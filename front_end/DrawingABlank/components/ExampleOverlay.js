/**
 * Example overlay
 * To be rendered in a Overlay.js container
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const ExampleOverlay = ({content}): Node => {
  return (
    <View>
      <Text style={styles.header}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 35,
    marginLeft: 5,
  },
});

export default ExampleOverlay;
