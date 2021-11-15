import React, {useState, useEffect, useRef} from 'react';
import {View} from 'react-native';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
  Animated,
} from 'react-native-maps';
import {getDistance} from 'geolib';
import Geolocation from 'react-native-geolocation-service';
import MapControls from './MapButtons';
import Sheet from '../bottomSheet/Sheet';
import {requestLocationPermission} from './permissions';
import {getInitialStateAnimated as getInitialState} from './testData';

import {styles} from './style.js';

const MAP_ZOOMLEVEL_CLOSE = {latitudeDelta: 0.005, longitudeDelta: 0.005};
const MAP_ZOOMLEVEL_FAR = {latitudeDelta: 0.0922, longitudeDelta: 0.0421};

function Map() {
  const [region, setRegion] = useState(getInitialState().region);
  const [markers, setMarkers] = useState(getInitialState().markers);
  const bottomSheetRef = useRef(null);

  function onRegionChange(region) {
    setRegion(region);
  }

  useEffect(() => {
    // Get User permission for location tracking, and initialize map to listen
    // if user permission not given, map will default to initial state - could change to anything e.g. dont render map at all nd show hser dialog
    // (logic could be moved to "withPermissions" hoc)
    setupGeolocation(({latitude, longitude}) => {
      const zoomLevel = MAP_ZOOMLEVEL_CLOSE;
      setRegion({
        //...region, //take previous zoom level
        ...zoomLevel, //take zoom level from constant
        latitude,
        longitude,
      });
    });
  }, []);

  return (
    <View style={styles.mapContainer}>
      <Animated
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        mapType={'standard'}>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
            draggable={marker.draggable}
          />
        ))}
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
          console.log('Starting Workout...');
        }}
      />
      <Sheet
        ref={bottomSheetRef}
        // should definitely be sorted - probably when I have "real" data from backend
        localEvents={markers}
        onEventClick={eventRegion =>
          setRegion({...MAP_ZOOMLEVEL_CLOSE, ...eventRegion})
        }
        // will probably need to redo how this works too at the same time
        calculateDistanceToUser={dest => {
          return getDistance(
            {longitude: region.longitude, latitude: region.latitude},
            dest,
          );
        }}
      />
    </View>
  );
}

const setupGeolocation = async _setRegion => {
  if ((await requestLocationPermission()).grantedStatus) {
    // Init Map to users current location
    Geolocation.getCurrentPosition(({coords}) => _setRegion(coords));

    // Listen for user movement, update map accordingly
    const watchId = Geolocation.watchPosition(
      ({coords}) => {
        _setRegion(coords);
      },
      e => {
        console.log(e);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  } else {
    console.log('User Permission for Location DENIED');
  }
};

export default Map;
