/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import Map from './src/components/mapView/Map.js';
import {StyleSheet, View} from 'react-native';

import OverlayDemo from './src/containers/OverlayDemo';
import {styles} from './src/components/mapView/style';

export default function App() {
  return (
    <View style={styles.mapContainer}>
      <Map />
      <OverlayDemo />
    </View>
  );
}
