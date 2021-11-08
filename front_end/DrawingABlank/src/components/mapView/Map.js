import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapControls from './MapControls';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

function Map() {
  const [region, setRegion] = useState(getInitialState().region);
  const [markers, setMarkers] = useState(getInitialState().markers);

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
          latlng: {latitude: 37.78825, longitude: -122.4324},
          draggable: true,
        },
      ],
    };
  }

  function onRegionChange(region) {
    setRegion(region);
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        mapType={'standard'}

        //onRegionChange={region => onRegionChange(region)}
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
      </MapView>

      <MapControls />
    </View>
  );
}

export default Map;
