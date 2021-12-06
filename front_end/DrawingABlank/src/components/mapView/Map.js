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
import setupGeolocation, {getCurrentPosition} from './geoLocation';

import {styles} from './style.js';

const MAP_ZOOMLEVEL_CLOSE = {latitudeDelta: 0.0005, longitudeDelta: 0.0005};
const MAP_ZOOMLEVEL_FAR = {latitudeDelta: 0.0922, longitudeDelta: 0.0421};
const USER_DRAW_DIAMETER = 1; // metres
const USER_INK_COLOUR = 'rgba(0, 255, 0, 0.75)';

function Map({setOverlayVisible, setOverlayContent}) {
  const [region, setRegion] = useState(getInitialState().region);
  const [markers, setMarkers] = useState(getInitialState().markers);
  const [userPath, setUserPath] = useState([]);
  const [colourSpaces, setColourSpaces] = useState(
    getInitialState().colourSpaces,
  );
  // need "map in use" ref to disable snapping to user loc when panning
  const userPathRef = useRef(userPath);
  const bottomSheetRef = useRef(null);
  const isMapTracking = useRef(true); // flag: detaches map from listening to user location
  const userLocation = useRef(region);

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

  function DrawPolygons() {
    return colourSpaces.map((space, i) => {
      if (!space.radius) {
        return (
          <Polygon
            coordinates={space.coordinates}
            strokeColor={space.strokeColor}
            fillColor={space.fillColor}
            strokeWidth={space.strokeWidth}
            key={i}
          />
        );
      } else {
        return (
          <Circle
            center={space.center}
            radius={space.radius}
            fillColor={space.fillColor}
            strokeWidth={0}
            key={i}
          />
        );
      }
    });
  }

  function DrawMarkers() {
    return markers.map((marker, index) => (
      <Marker
        key={index}
        coordinate={marker.latlng}
        title={marker.title}
        description={marker.description}
        draggable={marker.draggable}
        image={{
          uri: 'http://clipart-library.com/data_images/165937.png',
        }}
        onPress={() =>
          onEventPress(
            'Running event #' + index,
            'X:XX',
            'X',
            marker.description,
          )
        }
      />
    ));
  }

  useEffect(() => {
    console.log('userPath', userPath);
  }, [userPath]);

  useEffect(() => {
    // Get User permission for location tracking, and initialize map to listen
    // if user permission not given, map will default to initial state - could change to anything e.g. dont render map at all nd show hser dialog
    // (logic could be moved to "withPermissions" hoc)1
    // console.log('cs1', colourSpacesRef.current, colourSpaces);
    const watchId = setupGeolocation(
      userLocation => {
        const {latitude, longitude} = userLocation;
        const zoomLevel = MAP_ZOOMLEVEL_CLOSE;
        const oldUserPath = userPathRef.current;

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
        maximumAge: 0, // max age before it will refresh cache
        distanceFilter: 5, // min moved distance before next data point
      },
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
        <DrawPolygons />
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
        calculateDistanceToUser={useCallback(
          dest => {
            const latitude = userLocation.current.latitude;
            const longitude = userLocation.current.longitude;
            console.log(latitude instanceof Number);
            let b = 123.1421424;
            console.log(typeof b);
            return getDistance(
              {
                longitude,
                latitude,
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
