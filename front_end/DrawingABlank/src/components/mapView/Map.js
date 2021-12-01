import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View} from 'react-native';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
  Animated,
  Polygon,
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
const USER_INK_COLOUR = 'blue';

function Map() {
  const [region, setRegion] = useState(getInitialState().region);
  const [markers, setMarkers] = useState(getInitialState().markers);
  const [colourSpaces, setColourSpaces] = useState(
    getInitialState().colourSpaces,
  );
  const isMapTracking = useRef(true); // flag: detaches map from listening to user location
  const userLocation = useRef(region);
  const bottomSheetRef = useRef(null);

  function onRegionChange(region) {
    setRegion(region);
  }

  function drawPolygons() {
    return colourSpaces.map(space => (
      // currently rendering every colour space as a polygon
      // in future, will condense colour spaces by merging them
      // doabke after seeing backedn data type for tile colour

      <Polygon
        key={space.id}
        fillColor={space.colour}
        coordinates={space.coordinates}
      />
    ));
  }

  function DrawMarkers() {
    return markers.map((marker, index) => (
      <Marker
        key={index}
        coordinate={marker.latlng}
        title={marker.title}
        description={marker.description}
        draggable={marker.draggable}
      />
    ));
  }

  useEffect(() => {
    // Get User permission for location tracking, and initialize map to listen
    // if user permission not given, map will default to initial state - could change to anything e.g. dont render map at all nd show hser dialog
    // (logic could be moved to "withPermissions" hoc)1
    setupGeolocation(
      ({latitude, longitude}) => {
        userLocation.current = {latitude, longitude};
        if (isMapTracking.current) {
          const zoomLevel = MAP_ZOOMLEVEL_CLOSE;
          setRegion({
            //...region, //take previous zoom level
            ...zoomLevel, //take zoom level from constant
            latitude,
            longitude,
          });
        } else {
          setRegion({
            ...region,
          }); // do nothing i.e dont snap the map to user location e.g whilst panning and walking, not resetting regiok when looking at event
        }
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  return (
    <View style={styles.mapContainer}>
      <Animated
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        mapType={'standard'}>
        <DrawMarkers />
        {/* {drawPolygons()} */}
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
        // Hopefully now will at least be smart about recomputing distance - only done now on userLocation change
        calculateDistanceToUser={useCallback(
          dest => {
            return getDistance(
              {
                longitude: userLocation.current.longitude,
                latitude: userLocation.current.latitude,
              },
              dest,
            );
          },
          [userLocation],
        )}
      />
    </View>
  );
}

const setupGeolocation = async (handler, config) => {
  if ((await requestLocationPermission()).grantedStatus) {
    // Init Map to users current location
    Geolocation.getCurrentPosition(({coords}) => handler(coords));

    // Listen for user movement, update map accordingly
    const watchId = Geolocation.watchPosition(
      ({coords}) => {
        handler(coords);
      },
      e => {
        console.log(e);
      },
      config,
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  } else {
    console.log('User Permission for GeoLocation DENIED');
  }
};

export default Map;
