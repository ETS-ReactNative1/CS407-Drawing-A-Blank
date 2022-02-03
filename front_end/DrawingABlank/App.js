/**
 * For the moment, until we implement navigation, I'd say just let App.js just act as a place to test your UIs.
 */
import React, {useState} from 'react';
import Map from './src/components/mapView/Map.js';
import {StyleSheet, View} from 'react-native';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import WorkoutPostStats from './src/components/workout_recording/workout_post_stats.js';
import MapViewCompleteComponent from './src/components/mapView/MapViewCompleteComponent.js';
import AccountAuthUI from './src/components/account_ui/account_ui.js';
import EventPodium from './src/components/events/EventPodium.js';
import EventSummary from './src/components/events/EventSummary.js';
const Stack = createStackNavigator();

//Insert any code you wish to test here in order to see it. Note that before releasing the final version, we will want to change this back to the start screen.

export default function App() {
  return (
    /*
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="account"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="account" component={AccountAuthUI}/>
        <Stack.Screen
          name="map_view_complete"
          component={MapViewCompleteComponent}
        />
        <Stack.Screen name="post_workout_stats" component={WorkoutPostStats} />
      </Stack.Navigator>
    </NavigationContainer>
    */
    <EventSummary
      eventId={3}
      teams={["Windy","Terra","Ocean"]}
      points={[300,200,100]}
      personal_score={20}
      personal_team={"Windy"}
    />
  );
}
