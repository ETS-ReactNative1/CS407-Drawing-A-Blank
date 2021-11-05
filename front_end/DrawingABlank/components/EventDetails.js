/**
 * Event details overlay
 * To be rendered in a Overlay.js container
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const EventDetails = ({eventType, timeRemaining, radius, notes}): Node => {
  return (
    <View>
      <Text style={styles.header}>Event details</Text>
      <Text style={styles.header2}>{'\tEvent type'}</Text>
      <Text style={styles.body}>{`\t\t\t${eventType}`}</Text>
      <Text style={styles.header2}>{'\ttime remaining'}</Text>
      <Text style={styles.body}>{`\t\t\t${timeRemaining}`}</Text>
      <Text style={styles.header2}>{'\tEvent radius'}</Text>
      <Text style={styles.body}>{`\t\t\t${radius}`}</Text>
      <Text style={styles.header2}>{'\tEvent notes'}</Text>
      <Text style={styles.body}>{`\t\t\t${notes}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 35,
    marginLeft: 5,
  },
  header2: {
    fontSize: 30,
    marginLeft: 5,
  },
  body: {
    fontSize: 25,
    marginLeft: 5,
    marginRight: 10,
  },
});

export default EventDetails;
