import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Animated} from 'react-native-maps';
import MapControls from './MapButtons';
import Sheet from '../bottomSheet/Sheet';
import {styles} from './style.js';
import {useNavigation} from '@react-navigation/native';
import {debounce} from './utils';
import {useThrottle} from 'rooks';
import useUserPath from './useUserPath';
import AbsoluteComponent from '../hocs/AbsoluteComponent';
import haversine from 'haversine';
import useGeoLocation from './useGeoLocation';
import setupGeolocation from './geoLocation';

function Map({
  region,
  setRegion,
  regionFeatures,
  DrawRenderRegionFeatures,
  toggleSidebar,
}) {
  // Declaring Map State Hooks
  const [isMapTracking, setIsMapTracking] = useState(true);
  const [DrawUserPath, toggleWorkout, workout_active, userLocation] =
    useUserPath(isMapTracking);

  // DOM refs Hooks
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null);

  // Map Page Navigation
  const navigation = useNavigation();
  function changeToStats(recorder) {
    navigation.navigate('post_workout_stats', {recorder:recorder, upload:true});
  }

  // Debounced set region - prevents rapid renderRegion checks/changes
  const debouncedsetRegion = debounce(
    // should ideally be a throttle not a debounce
    newRegion => setRegion(newRegion),
    1000,
  );

  // Map region change handler
  function handleRegionChange(newRegion) {
    debouncedsetRegion(newRegion);
    return;
  }

  useEffect(() => {
    const watchId = setupGeolocation(
      userLocation => {
        const {latitude, longitude} = userLocation;
        userLocation.current = {latitude, longitude}
      },
      {
        enableHighAccuracy: true,
        timeout: 200, // max time for location request duration
        maximumAge: 1000, // max age before it will refresh cache
        distanceFilter: 5, // min moved distance before next data point
      }
    )
  })

  return (
    <View style={styles.mapContainer}>
      <Animated
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        mapType={'standard'}
        showsUserLocation={true}
        onRegionChange={r => handleRegionChange(r)}
        ref={mapRef}
        minZoomLevel={10}
        // maxZoomLevel={10}
      >
        {<DrawRenderRegionFeatures showRegionOutline={false} />}
        <DrawUserPath />
      </Animated>

      <MapControls
        ghost_inactive={isMapTracking}
        workout_active={workout_active.current}
        toggleWorkout={workout_type =>
          toggleWorkout(changeToStats, workout_type)
        }
        toggleGhostMode={() => setIsMapTracking(!isMapTracking)}
        toggleShowEventsList={() => bottomSheetRef.current.expand()}
        toggleSidebar={toggleSidebar}
        refresh_map={() => setRegion(region)}
      />

      <Sheet
        ref={bottomSheetRef}
        localEvents={regionFeatures.events}
        onEventClick={eventRegion => {
          const cam = mapRef.getCamera();
          cam.center.latitude = eventRegion.latitude;
          cam.center.longitude = eventRegion.longitude;
          mapRef.animateCamera(cam);
        }}
        // will probably need to redo how this works too at the same time
        calculateDistanceToUser={useCallback(dest => {
          return haversine(userLocation.current, dest, {unit: 'km'}).toFixed(2);
        })}
      />
    </View>
  );
}

export default Map;
