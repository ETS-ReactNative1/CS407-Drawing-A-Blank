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
import EventLeaderboard from './EventLeaderboard';

const EventDetails = ({eventType, timeRemaining, radius, desc}): Node => {
  return (
    <View style={{width:"100%"}}>
      <Text style={styles.header}>Event details</Text>
      <Text style={styles.header2}>{'\tEvent type'}</Text>
      <Text style={styles.body}>{`\t\t\t${eventType}`}</Text>
      <Text style={styles.header2}>{'\Time remaining'}</Text>
      <Text style={styles.body}>{`\t\t\t${timeRemaining}`}</Text>
      <EventLeaderboard title="Event leaderboard" data={[{
          title:"Ocean",
          picture:require('../../assets/img/ocean.png'),
          points:154
        },
        {
          title:"Windy",
          picture:require('../../assets/img/windy.png'),
          points:143
        },
        {
          title:"Terra",
          picture:require('../../assets/img/terra.png'),
          points:125
        }]}/>
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
