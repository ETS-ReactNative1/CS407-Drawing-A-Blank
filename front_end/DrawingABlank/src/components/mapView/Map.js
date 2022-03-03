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
import ExampleMarkers from '../events/resources/ExampleMarkers';
import {Workout} from '../workout_recording/workout';
import {useNavigation} from '@react-navigation/native';
import {NavigationRouteContext} from '@react-navigation/core';
import setupGeolocation from './geoLocation';
import { getGrids } from '../../api/api_grids';

const recorder = new Workout();
const MAP_ZOOMLEVEL_CLOSE = {latitudeDelta: 0.0005, longitudeDelta: 0.0005};
const MAP_ZOOMLEVEL_FAR = {latitudeDelta: 0.0922, longitudeDelta: 0.0421};
const USER_DRAW_DIAMETER = 1; // metres
const USER_INK_COLOUR = 'rgba(0, 255, 0, 0.75)';

const DEBUG_ZOOM_LEVEL = 0.01;

function Map({setOverlayVisible, setOverlayContent, eventsRetrieved, mapRetrieved, initialLocation}) {
  const [region, setRegion] = useState(initialLocation);
  //const [markers, setMarkers] = useState([]);
  //const [colourSpaces, setColourSpaces] = useState(
  //  getInitialState().colourSpaces,
  //); //getInitialState().colourSpaces)
  const navigation = useNavigation();

  const workout_button_start = 'Start Workout';
  const workout_button_stop = 'Stop Workout';

  const [workout_button_text, set_workout_button_text] =
    useState(workout_button_start);
  const [workout_active, set_workout_active] = useState(false);
  const [userPath, setUserPath] = useState([]);
  const userPathRef = useRef(userPath);
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

  function DrawPolygons() {
    return events.map((space, i) => {
      if (!space.radius) {
        return (
          <Polygon
            coordinates={space.bounds.coordinates}
            strokeColor={space.bounds.strokeColor}
            fillColor={space.bounds.fillColor}
            strokeWidth={space.bounds.strokeWidth}
            key={i}
          />
        );
      } else {
        return (
          <Circle
            center={space.bounds.center}
            radius={space.bounds.radius}
            fillColor={space.bounds.fillColor}
            strokeWidth={0}
            key={i}
          />
        );
      }
    });
  }

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

  return (
    <View style={styles.mapContainer}>
      <Animated 
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        region={region}
        mapType={'standard'}
        showsUserLocation={true}>
        <DrawGrids />
        <DrawMarkers />
        <DrawPolygons />
        {workout_active ? <DrawUserPath /> : false}
      </Animated>

      <MapControls
        toggleGhostMode={() => {
          console.log('Enabling Ghost mode...');
        }}
        toggleShowEventsList={() => {
          console.log('Opening Events Bottom Tray...');
          bottomSheetRef.current.expand();
        }}
        startWorkout={() => {
          if (!workout_active) {
            console.log('Starting Workout...');
            recorder.startWorkout();
            Geolocation.getCurrentPosition(({coords}) =>
               recorder.addCoordinate(coords.latitude, coords.longitude),
            );
            set_workout_active(true);
            set_workout_button_text(workout_button_stop);
          } else {
            console.log('Stopping Workout...');
            recorder.stopWorkout();
            set_workout_active(false);
            set_workout_button_text(workout_button_start);
            changeToStats();
          }
        }}
        workoutText={workout_button_text}
        drawGridsFunction={collectGrids}
      />
      <Sheet
        ref={bottomSheetRef}
        // should definitely be sorted - probably when I have "real" data from backend
        localEvents={events}
        onEventClick={eventRegion =>
          setRegion({...MAP_ZOOMLEVEL_CLOSE, ...eventRegion})
        }
        // will probably need to redo how this works too at the same time
        calculateDistanceToUser={
          useCallback((dest) => {
            //To fix
            return 0;
          })
        }
      />
    </View>
  );
}

// in case we want to draw the user path from polygons
// can return polygons, representing the last two datapoints
// or can return circles representing a single data point
function generateColourSpace(to, from) {
  const {longitude: toLong, latitude: toLat} = to;

  // low service mode - draw between points (might end up being normal use depending on location polling rate and performance)
  //  might accidentally be reimplementing backend feature
  //  should be on frontend tho - dont want to send to server if in low data zone
  // will keep until otherwise relevent
  if (from) {
    const {longitude: fromLong, latitude: fromLat} = from;

    return {
      // unfinished
      coordinates: [
        {latitude: 37.8025259, longitude: -122.4351431},
        {latitude: 37.7896386, longitude: -122.421646},
        {latitude: 37.7665248, longitude: -122.4161628},
        {latitude: 37.7734153, longitude: -122.4577787},
      ],
      strokeColor: '#000',
      fillColor: 'rgba(43, 145, 222, 0.54)',
      strokeWidth: 1,
      name: 'Example area',
      id: 0,
    };
  }
  // Only one param given - draw polygon spot, for now circle around the user location
  // should result in a sequence of circles drawn over time - on each user location update = path
  // still v sloppy, one "circle" per user blip - could combine multiple into a complex polygon easily
  // just dont know if it will actually help performance - should: fewer objects
  else
    return {
      center: to,
      radius: USER_DRAW_DIAMETER / 2,
      fillColor: USER_INK_COLOUR,
      strokeWidth: 0,
      id: Math.floor(Math.random() * 1000000),
    };
}

export default Map;
