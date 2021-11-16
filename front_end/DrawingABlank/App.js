/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import Map from './src/components/mapView/Map.js';
import {StyleSheet, View} from 'react-native';

import OverlayDemo from './src/containers/OverlayDemo';
import {styles} from './src/components/mapView/style';
import EventDetails from './src/components/events/EventDetails';
import ExampleOverlay from './src/components/events/ExampleOverlay';
import Overlay from './src/containers/Overlay';

export default function App() {

  const [overlayVisible, setOverlayVisible] = useState(false);
  // use setOverlayContent to change the content of the overlay
  const [overlayContent, setOverlayContent] = useState();

  return (
    <View style={styles.mapContainer}>
      <Map
        setOverlayVisible={setOverlayVisible}
        setOverlayContent={setOverlayContent}
      />
      <Overlay
        visible={overlayVisible}
        setVisible={setOverlayVisible}
        children={overlayContent}
      />
    </View>
  );
}
