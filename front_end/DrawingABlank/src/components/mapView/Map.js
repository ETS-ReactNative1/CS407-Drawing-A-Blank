import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Animated,
} from 'react-native-maps';
import MapControls from './MapButtons';
import Sheet from '../bottomSheet/Sheet';
import {styles} from './style.js';
import {useNavigation} from '@react-navigation/native';
import {debounce} from './utils';
import {useThrottle} from "rooks"
import useUserPath from './useUserPath';

function Map({
  region,
  setRegion,
  regionFeatures,
  DrawRenderRegionFeatures
}) {  
  
  // Declaring Map State Hooks
  const [isMapTracking, setIsMapTracking] = useState(true);
  const [DrawUserPath, toggleWorkout, workout_active] = useUserPath(isMapTracking)

  // DOM refs Hooks
  const bottomSheetRef = useRef(null);
  const mapRef = useRef(null)

  // Map Page Navigation
  const navigation = useNavigation();
  function changeToStats(recorder) {
    navigation.navigate('post_workout_stats', {recorder});
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
        // minZoomLevel={5}
        // maxZoomLevel={10}
      >
        {<DrawRenderRegionFeatures showRegionOutline={true} />}
        <DrawUserPath />
      </Animated>

      <MapControls
        ghost_active={isMapTracking}
        workout_active={workout_active.current}
        toggleWorkout={() => toggleWorkout(changeToStats)}
        toggleGhostMode={() => setIsMapTracking(!isMapTracking)}
        toggleShowEventsList={() => bottomSheetRef.current.expand()}
      />

      <Sheet
        ref={bottomSheetRef}
        localEvents={regionFeatures.events}
        onEventClick={eventRegion => {
          const cam = mapRef.getCamera()
          cam.center.latitude = eventRegion.latitude
          cam.center.longitude = eventRegion.longitude
          mapRef.animateCamera(cam)          
          }
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
