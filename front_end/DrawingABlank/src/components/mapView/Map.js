import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View} from 'react-native';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
  Animated,
  Polygon,
  Circle,
  Polyline,
} from 'react-native-maps';
import {getDistance} from 'geolib';

import MapControls from './MapButtons';
import Sheet from '../bottomSheet/Sheet';
import {getInitialStateAnimated as getInitialState} from './testData';
import {getEvents, getEventScores} from '../../api/api_events';

import Geolocation from 'react-native-geolocation-service';
import {styles} from './style.js';
import EventDetails from '../events/EventDetails';
import {Workout} from '../workout_recording/workout';
import {useNavigation} from '@react-navigation/native';
import useGeoLocation from './useGeoLocation';

import useUserPath from './useUserPath';
import useRegion from './useRegion';
import {useDidUpdateEffect} from '../hooks/useDidUpdateEffect';
import useZoomLevel from './useZoomLevel';

import {debounce} from './utils';

const recorder = new Workout();
const MAP_ZOOMLEVEL_CLOSE = {latitudeDelta: 0.0005, longitudeDelta: 0.0005};
const MAP_ZOOMLEVEL_FAR = {latitudeDelta: 0.0922, longitudeDelta: 0.0421};

const MAP_ZOOMLEVEL_CLOSEST = {latitudeDelta: 0.0005, longitudeDelta: 0.0005};
const MAP_ZOOMLEVEL_FURTHEST = {latitudeDelta: 0.0922, longitudeDelta: 0.0421};

const USER_DRAW_DIAMETER = 1; // metres
const USER_INK_COLOUR = 'rgba(0, 255, 0, 0.75)';

const DEBUG_ZOOM_LEVEL = {
  latitudeDelta: 0.6039001489487674,
  longitudeDelta: 0.5393288657069206,
};

// needs optimizations - map can be slow
// https://hackernoon.com/how-to-optimize-react-native-map-in-your-application-eeo3nib
// mostly just memoize
// and perhaps clustering

function Map({setOverlayVisible, setOverlayContent, eventsRetrieved, mapRetrieved, initialLocation}) {
  const [region, setRegion, regionFeatures, DrawRenderRegionFeatures] =
    useRegion();
  console.log('Regions Setup');
  const [DrawUserPath, userPath] = useUserPath();

  // const [region, setRegion] = useState(getInitialState().region);
  const navigation = useNavigation();

  const workout_button_start = 'Start Workout';
  const workout_button_stop = 'Stop Workout';

  const [workout_button_text, set_workout_button_text] =
    useState(workout_button_start);
  // const workout_button_ref = useRef()
  const [workout_active, set_workout_active] = useState(false);
  // const [userPath, setUserPath] = useState([]);
  // const userPathRef = useRef(userPath);
  const bottomSheetRef = useRef(null);
  const isMapTracking = useRef(true); // flag: detaches map from listening to user location
  const userLocation = useRef(region);

  const [events, setEvents] = useState([]);

  const [grids, setGrids] = useState([]);

  const [eventScores, setEventScores] = useState({});

  function onRegionChange(region) {
    setRegion(region);
  }

  // issue with user location sensitivity being too low
  // moving between two close-by locations wont move map

  // draw user path onto map
  function DrawUserPath() {
    return (
      <Polyline
        coordinates={userPath}
        strokeWidth={3 || USER_DRAW_DIAMETER}
        strokeColor={USER_INK_COLOUR}
      />
    );
  }

  function DrawGrids(){
    return grids.map((grid, i)=>{
      if(grid.bounds.length > 0){
        return(
          <Polygon
            coordinates={grid.bounds}
            strokeColor={"#000000"}
            fillColor={"#"+grid.colour}
            strokeWidth={1}
            key={i}
          >

          </Polygon>
        );
      }
    });
  }

  // might want to make hooks "pausible" if using state (not refs), e.g. dont re render on userpath change, if were not showing it
  //    more an issue of proper state updates/ only do updates which we want to be shown
  // refs are always "paused", must be manually listened to using useEffect
  const userLocation = useGeoLocation(location =>
    recorder.addCoordinate(
      location.longitude,
      location.latitude,
      isMapTracking.current,
    ),
  );

  function DrawMarkers() {
    return events.map(event => (
      <Marker
        key={event.id}
        coordinate={event.marker}
        title={event.title}
        anchor={{x: 0, y: 1}}
        description={event.description}
        image={{
          uri: 'http://clipart-library.com/data_images/165937.png',
        }}
        onPress={() => {
          var current_date = new Date();
          var event_date = Date.parse(event.date_end);
          var time_left = event_date - current_date;
          console.log(current_date);
          console.log(event.date_end);
          var days = Math.floor(time_left / (1000 * 3600 * 3600));
          var hours = Math.floor(time_left / (1000 * 3600)) % 24;
          var minutes = Math.floor(time_left / (1000 * 60)) % 60;
          var seconds = Math.floor(time_left / 1000) % 60;
          onEventPress(
            event.id,
            days + ':' +
            (hours < 10? '0' + hours : hours) +
              ':' +
              (minutes < 10? '0' + minutes : minutes) +
              ':' +
              (seconds < 10 ? '0' + seconds : seconds),
            event.description,
          );
        }}
      />
    ));
  }

  function onEventPress(type, time, radius, desc) {
    // eventType, timeRemaining, radius, desc
    setOverlayContent(
      <EventDetails
        eventType={"Event #" + type}
        timeRemaining={time}
        radius={radius}
        desc={desc}
        eventScoreData={eventScores[type]}
      />,
    );
    setOverlayVisible(true);
  }

  function changeToStats() {
    navigation.navigate('post_workout_stats', {recorder: recorder});
  }

  function collectGrids() {
    /*Geolocation.getCurrentPosition(({coords}) => {
      getGrids([coords.latitude - DEBUG_ZOOM_LEVEL, coords.longitude - DEBUG_ZOOM_LEVEL], 
      [coords.latitude + DEBUG_ZOOM_LEVEL, coords.longitude + DEBUG_ZOOM_LEVEL])
      .then(result => {setGrids(result);console.log("GRID AMOUNT:"+result.length)});
    });*/
    setGrids(mapRetrieved);
  }
  
  function collectEventScores(){
    console.log("CALCULATING SCORES");
    console.log("HAVE EVENTS:" + events);
    result = {};
    events.forEach((event) => {
      console.log("GOT EVENT:" + JSON.stringify(event));
      var eventScore = getEventScores(grids,event["bounds"]["coordinates"]);
      if(eventScore.length != 0){
        converted_result = []
        eventScore.forEach(score => {
          converted_result.push({
            title:score["details"]["team"],
            picture:score["details"]["picture"],
            points:score["count"]
          });
        });
        result[event.id] = converted_result;
      }
    }); 
    setEventScores(result);
    console.log(result);
  }

  useEffect(() => {
    console.log("INTIIAL REGION:"+JSON.stringify(initialLocation))
    // Get User permission for location tracking, and initialize map to listen
    // if user permission not given, map will default to initial state - could change to anything e.g. dont render map at all nd show hser dialog
    // (logic could be moved to "withPermissions" hoc)1
    // console.log('cs1', colourSpacesRef.current, colourSpaces);
    const watchId = setupGeolocation(
      userLocation => {
        const {latitude, longitude} = userLocation;
        const zoomLevel = MAP_ZOOMLEVEL_CLOSE;
        const oldUserPath = userPathRef.current;
        
        recorder.addCoordinate(latitude,longitude);
        
        userLocation.current = {latitude, longitude};
        //draw new user movement polygon - map their travelled path
        userPathRef.current = [
          ...oldUserPath,
          {latitude, longitude},
          // shows path as a series of discrete data points
          //generateColourSpace(userLocation),
          //generateColourSpace(userLocation, region), // for use when we want to implement working in low service locations - draw between last known locatoins
        ];
        setUserPath(userPathRef.current);

        if (isMapTracking.current) {
          setRegion({
            //...region, //take previous zoom level
            ...zoomLevel, //take zoom level from constant
            latitude,
            longitude,
          });
        } else {
        } //do nothing - dont snap the map away from user pan
      },
      {
        enableHighAccuracy: true,
        timeout: 200, // max time for location request duration
        maximumAge: 1000, // max age before it will refresh cache
        distanceFilter: 5, // min moved distance before next data point
      },
    );

    //getEvents().then(result => setEvents(result));
    setEvents(eventsRetrieved);
    collectGrids();
      
    }, []);
    
    useEffect(() => {
      collectEventScores();
    },[grids]);
  const debouncedsetRegion = debounce(
    // set ref renderRegion
    // only update state of updateRegion if old region is "far away enough" from old point
    newRegion => setRegion(newRegion),
    1000,
  );

  // useEffect(() => {
  //   addPathPoint(userLocation.current);

  //   const {latitude, longitude} = userLocation.current;
  //   const zoomLevel = MAP_ZOOMLEVEL_CLOSE;
  //   const oldUserPath = userPathRef.current;

  //   recorder.addCoordinate(latitude, longitude);

  //   //draw new user movement polygon - map their travelled path
  //   userPathRef.current = [...oldUserPath, {latitude, longitude}];

  //   setUserPath(userPathRef.current);
  //   if (isMapTracking.current) {
  //     // setRegion({ // !! No longer doing following a user on map !!
  //     //   //...region, //take previous zoom level
  //     //   ...zoomLevel, //take zoom level from constant
  //     //   latitude,
  //     //   longitude,
  //     // });
  //   } else {
  //   }
  // }, [userLocation.current]);
  // console.log('remount', region);

  useDidUpdateEffect(() => {
    // set to map to user location when user location known (second userLocation change (init state -> actual))
    if (isMapTracking.current) {
      const {latitude, longitude} = userLocation.current;
      console.log('region change', region);
      setRegion({
        // !! No longer doing following a user on map !!
        //...region, //take previous zoom level
        // ...zoomLevel, //take zoom level from constant
        ...MAP_ZOOMLEVEL_CLOSE,
        latitude,
        longitude,
        //longitudeDelta: region.longitudeDelta,
        //latitudeDelta: region.latitudeDelta,
      });
    }
  }, [userLocation.current]);

  function handleRegionChange(newRegion) {
    debouncedsetRegion(newRegion);
    return;

    const {longitude, latitude, longitudeDelta, latitudeDelta} = newRegion;
    // console.log('new', newRegion);
    const zoom = {longitudeDelta, latitudeDelta};
    //setGridDrawScale(zoom);
    setZoomLevel(zoom);
    return;

    // zoom = convertZoomRepresentation({longitudeDelta, latitudeDelta});
    // setGridDrawScale(zoom);

    function convertZoomRepresentation(RNM_Zoom) {
      // #1 Converting map zoom level to backend zoom arg type
      // #2 Managing the frequency of requests made for a new zoom level/tile size

      const {longitudeDelta, latitudeDelta} = RNM_Zoom;
    }
  }
  console.log('showing location', region);
  return (
    <View style={styles.mapContainer}>
      <Animated 
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        region={region}
        // initialRegion={viewRegion}
        mapType={'standard'}
        showsUserLocation={true}
        onRegionChangeComplete={r => setRegion(r)}
        //onRegionChange={r => handleRegionChange(r)}
        // minZoomLevel={5}
        // maxZoomLevel={10}
      >
        {/* Region features need memoizing */}
        {<DrawRenderRegionFeatures showRegionOutline={true} />}

        <DrawUserPath />
      </Animated>

      <MapControls
        toggleGhostMode={() => {
          isMapTracking.current = !isMapTracking.current;
          console.log('Enabling Ghost mode...');
        }}
        toggleShowEventsList={() => {
          console.log('Opening Events Bottom Tray...');
          bottomSheetRef.current.expand();
        }}
        startWorkout={() => {
          if (!workout_active) {
            startWorkout();
            set_workout_button_text(workout_button_stop);
          } else {
            stopWorkout();
            set_workout_button_text(workout_button_start);
            changeToStats();
          }
        }}
        workout_active={workout_active}
        workoutText={workout_button_text}
        drawGridsFunction={() => {}}
        // drawGridsFunction={() => getGrids.then(grids => setGrids(grids))}
      />

      <Sheet
        ref={bottomSheetRef}
        localEvents={regionFeatures.events}
        onEventClick={eventRegion =>
          setRegion({...MAP_ZOOMLEVEL_CLOSE, ...eventRegion})
        }
        // will probably need to redo how this works too at the same time
        calculateDistanceToUser={useCallback(dest => {
          //To fix
          return 0;
        })}
      />
    </View>
  );
}

export default Map;
