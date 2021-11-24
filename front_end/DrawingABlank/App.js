/**
 * For the moment, until we implement navigation, I'd say just let App.js just act as a place to test your UIs.
 */
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import WorkoutScreen from './src/components/workout_recording/workout_screen';

export default function App() {
  return(
    <WorkoutScreen/>
  );
}