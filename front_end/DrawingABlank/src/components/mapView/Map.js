import React, {useState, useEffect} from 'react';
import {View, Platform, PermissionsAndroid} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapControls from './MapControls';

import {styles} from './style.js';
import EventDetails from '../events/EventDetails';

const requestLocationPermission = async () => {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
  } catch (err) {
    console.log(err);
  }
};

function Map({setOverlayVisible, setOverlayContent}) {
  const [region, setRegion] = useState(getInitialState().region);
  const [markers, setMarkers] = useState(getInitialState().markers);
  const [event_markers, setEventMarkers] = useState(
    getInitialState().event_markers,
  );

  function onEventPress() {
    // eventType, timeRemaining, radius, desc
    setOverlayContent(
      <EventDetails
        eventType={'running'}
        timeRemaining={'10'}
        radius={'10'}
        desc={'tet'}
      />,
    );
    setOverlayVisible(true);
  }

  function getInitialState() {
    return {
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [
        {
          id: 0,
          title: 'firstMarker',
          description: 'checking this works',
          // geo fix -122.4324 37.78825
          latlng: {latitude: 37.78825, longitude: -122.4324},
          draggable: true,
        },
      ],
      event_markers: [
        {
          id: 1,
          title: 'Example Event',
          description: 'Example clickable event werweR',
          //geo fix -120.4324 38.78825
          latlng: {latitude: 38.78825, longitude: -120.4324},
          image_uri: 'http://clipart-library.com/data_images/165937.png',
          draggable: false,
        },
      ],
    };
  }

  function onRegionChange(region) {
    setRegion(region);
  }

  useEffect(() => {
    requestLocationPermission();
    const watchId = Geolocation.watchPosition(
      ({coords: position}) => {
        console.log('geo', position);
        setRegion({
          latitude: position.latitude,
          longitude: position.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      },
      e => {
        console.log(e);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <View style={styles.mapContainer}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        mapType={'standard'}
        // onRegionChange={region => onRegionChange(region)}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
            draggable={marker.draggable}
          />
        ))}
        {event_markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.latlng}
            title={marker.title}
            description={marker.description}
            draggable={marker.draggable}
            image={{
              uri: String(marker.image_uri),
            }}
            onPress={() => onEventPress()}
          />
        ))}
      </MapView>

      <MapControls />
    </View>
  );
}

export default Map;
