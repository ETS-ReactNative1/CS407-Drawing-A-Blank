/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {StyleSheet, View} from 'react-native';

import OverlayDemo from './src/containers/OverlayDemo';

const App: () => Node = () => {
  return (
    <View>
      <OverlayDemo />
    </View>
  );
};

const styles = StyleSheet.create({});

export default App;
