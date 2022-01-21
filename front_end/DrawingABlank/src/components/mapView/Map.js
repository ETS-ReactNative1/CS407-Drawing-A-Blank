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
import {getEvents} from '../../api/api_events';

import Geolocation from 'react-native-geolocation-service';
import {styles} from './style.js';
import EventDetails from '../events/EventDetails';
import ExampleMarkers from '../events/resources/ExampleMarkers';
import {Workout} from '../workout_recording/workout';
import {useNavigation} from '@react-navigation/native';
import {NavigationRouteContext} from '@react-navigation/core';
import setupGeolocation from './geoLocation';
import {getGrids} from '../../api/api_grids';
import useLocalGrids from './useLocalGrids';
import useGeoLocation from './useGeoLocation';

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

function Map({setOverlayVisible, setOverlayContent}) {
  const [region, setRegion] = useState(getInitialState().region);
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

  const [DrawGrids, setGridDrawScale] = useLocalGrids(DEBUG_ZOOM_LEVEL);
  const userLocation = useGeoLocation();

  const [events, setEvents] = useState([]);

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
          var hours = Math.floor(time_left / (1000 * 3600));
          var minutes = Math.floor(time_left / (1000 * 60)) % 60;
          var seconds = Math.floor(time_left / 1000) % 60;
          onEventPress(
            'Running event #' + event.id,
            hours +
              ':' +
              minutes +
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
        eventType={type}
        timeRemaining={time}
        radius={radius}
        desc={desc}
      />,
    );
    setOverlayVisible(true);
  }

  function changeToStats() {
    navigation.navigate('post_workout_stats', {recorder: recorder});
  }

  useEffect(() => {
    const {latitude, longitude} = userLocation;
    const zoomLevel = MAP_ZOOMLEVEL_CLOSE;
    const oldUserPath = userPathRef.current;

    recorder.addCoordinate(latitude, longitude);

    //draw new user movement polygon - map their travelled path
    userPathRef.current = [...oldUserPath, {latitude, longitude}];

    setUserPath(userPathRef.current);
    if (isMapTracking.current) {
      setRegion({
        //...region, //take previous zoom level
        ...zoomLevel, //take zoom level from constant
        latitude,
        longitude,
      });
    } else {
    }
  }, [userLocation]);

  useEffect(() => {
    getEvents().then(result => setEvents(result || []));
  }, []);

  function handleRegionChange(newRegion) {
    const {longitude, latitude, longitudeDelta, latitudeDelta} = newRegion;

    const zoom = convertZoomRepresentation({longitudeDelta, latitudeDelta});

    function convertZoomRepresentation(RNM_Zoom) {
      // #1 Converting map zoom level to backend zoom arg type
      // #2 Managing the frequency of requests made for a new zoom level/tile size

      const {longitudeDelta, latitudeDelta} = RNM_Zoom;

      // backend debug = 0.01 for field of view
      // 10 for tile
      setGridDrawScale(RNM_Zoom);

      // when zoomed out enough, want to merge tiles
      // i.e. downsample

      // have a few different LoDs (level of detail)
      // either cache each LoD or just generate a new request
      // unfeasible to do a new LoD for continuous scale
      //    too many requests per second or too much memory usage
      // For now, no cache the request not the response grid object
      //    making a new request even if no changes to LoD
      // still requires LoD setups tho - discretize the zoom

      // deltas ratio is constant, (range due to different phone dimensions)
      // take just one of the deltas as level of zoom

      // are essentially picking most suitable tilesize
      // based on screen size/ map size

      // get tile size of that bucket
      // "what tile size corresponsds to this lod level"
      //zoomLoDs[zoomLoD] = tileSize;

      // need map of zoom levels to zub sample
      // i.e. scale subsampling (zoom arg) with region zoom/ pinch
      // but want them to appear the same size on screen regardless of zoom level
      //

      // to be made continous
      // will need to seperae from backend
      // otherwise space or time becomes and issue (round trip time vs cahce memory)
      // contiuos - get most detailed tile set
      // work on that set on front end - compute better size from that -
      //    would require merging/downsampling on the frontend
    }
  }

  return (
    <View style={styles.mapContainer}>
      <Animated
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        mapType={'standard'}
        showsUserLocation={true}
        onRegionChange={r => handleRegionChange(r)}
        minZoomLevel={5}
        maxZoomLevel={10}>
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
        drawGridsFunction={() => {}}
        // drawGridsFunction={() => getGrids.then(grids => setGrids(grids))}
      />
      <Sheet
        ref={bottomSheetRef}
        localEvents={events}
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
