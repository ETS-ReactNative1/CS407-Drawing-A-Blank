/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {Button, StyleSheet, View} from 'react-native';

import Overlay from './containers/Overlay';

const App: () => Node = () => {
  const [overlayVisible, setOverlayVisible] = useState(true);

  return (
    <View>
      <Button title={'showmodal'}>Click</Button>
      <Overlay visible={overlayVisible} setVisible={setOverlayVisible()} />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
