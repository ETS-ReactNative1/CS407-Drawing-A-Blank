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
import Geolocation from 'react-native-geolocation-service';
import {styles} from './style.js';
import EventDetails from '../events/EventDetails';
import {Workout} from '../workout_recording/workout';
import {useNavigation} from '@react-navigation/native';
import useLocalGrids from './useLocalGrids';
import useGeoLocation from './useGeoLocation';
import useEvents from './useEvents';
import useUserPath from './useUserPath';
import useRegion from './useRegion';
import {useDidUpdateEffect} from '../hooks/useDidUpdateEffect';
import useZoomLevel from './useZoomLevel';

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
  const [region, setRegion] = useRegion();
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

  // might want to make hooks "pausible" if using state (not refs), e.g. dont re render on userpath change, if were not showing it
  //    more an issue of proper state updates/ only do updates which we want to be shown
  // refs are always "paused", must be manually listened to using useEffect
  const userLocation = useGeoLocation();
  const [DrawGrids, grids] = useLocalGrids([], {
    useCache: 1,
  });
  // const [zoomLevel, tileSize, setZoomLevel] = useZoomLevel();

  const [DrawEvents, events] = useEvents();
  const [DrawUserPath, userPath] = useUserPath();
  // const [region, setRegion] = useRegion();
  // console.log('region', region);
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
    setRegion(newRegion);
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

  return (
    <View style={styles.mapContainer}>
      <Animated
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        // region={region}
        initialRegion={region}
        mapType={'standard'}
        showsUserLocation={true}
        onRegionChange={r => handleRegionChange(r)}
        // minZoomLevel={5}
        // maxZoomLevel={10}
      >
        <DrawGrids />
        <DrawEvents />
        <DrawUserPath />
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
            startWorkout();
            set_workout_button_text(workout_button_stop);
          } else {
            stopWorkout();
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
