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

const EventDetails = ({eventType, timeRemaining, radius, desc, eventScoreData}): Node => {
  console.log('EVENT DETAILS RECEIVED:'+JSON.stringify(eventScoreData));
  return (
    <View style={{width:"100%"}}>
      <Text style={styles.header}>Event details</Text>
      <Text style={styles.header2}>{'\tEvent type'}</Text>
      <Text style={styles.body}>{`\t\t\t${eventType}`}</Text>
      <Text style={styles.header2}>{'\Time remaining'}</Text>
      <Text style={styles.body}>{`\t\t\t${timeRemaining}`}</Text>
      {eventScoreData.length != 0 ?
      <EventLeaderboard title="Event leaderboard" data={eventScoreData}/>
      : <Text style={styles.body}>No one has participated in this event yet!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontWeight: 'bold',
    fontSize: 35,
    marginLeft: 5,
    marginTop: 15,
    color:'black'
  },
  header2: {
    fontSize: 30,
    marginLeft: 5,
    color:'black'
  },
  body: {
    fontSize: 25,
    marginLeft: 5,
    marginRight: 10,
    color:'black'
  },
});

export default EventDetails;
