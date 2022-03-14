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

function Map({setOverlayVisible, setOverlayContent}) {
  const [region, setRegion, regionFeatures, DrawRenderRegionFeatures] =
    useRegion();
  console.log('Regions Setup');
  const [
    DrawUserPath,
    startWorkout,
    stopWorkout,
    addPathPoint,
    workout_active,
  ] = useUserPath();
  // need the region ref out here so other states can update
  const navigation = useNavigation();

  const workout_button_start = 'Start Workout';
  const workout_button_stop = 'Stop Workout';

  const [workout_button_text, set_workout_button_text] =
    useState(workout_button_start);

  const bottomSheetRef = useRef(null);
  const isMapTracking = useRef(true); // flag: detaches map from listening to user location

  const userLocation = useGeoLocation(location => {
    console.log('gel');
    addPathPoint(location, isMapTracking.current);
  });

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

  const debouncedsetRegion = debounce(
    // set ref renderRegion
    // only update state of updateRegion if old region is "far away enough" from old point
    newRegion => setRegion(newRegion),
    1000,
  );

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
        region={region}
        // initialRegion={viewRegion}
        mapType={'standard'}
        showsUserLocation={true}
        //onRegionChangeComplete={r => setRegion(r)}
        onRegionChange={r => handleRegionChange(r)}
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
          if (!workout_active.current) {
            startWorkout();
            set_workout_button_text(workout_button_stop);
          } else {
            stopWorkout();
            set_workout_button_text(workout_button_start);
            changeToStats();
          }
        }}
        workout_active={workout_active.current}
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
