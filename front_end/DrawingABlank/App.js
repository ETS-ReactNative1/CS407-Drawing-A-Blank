/**
 * For the moment, until we implement navigation, I'd say just let App.js just act as a place to test your UIs.
 */
import React, {useState} from 'react';
import Map from './src/components/mapView/Map.js';
import {StyleSheet, View} from 'react-native';

import OverlayDemo from './src/containers/OverlayDemo';
import {styles} from './src/components/mapView/style';
import EventDetails from './src/components/events/EventDetails';
import ExampleOverlay from './src/components/events/ExampleOverlay';
import Overlay from './src/containers/Overlay';
import WorkoutPostStats from './src/components/workout_recording/workout_post_stats.js';
import { Workout } from './src/components/workout_recording/workout.js';

export default function App() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  // use setOverlayContent to change the content of the overlay
  const [overlayContent, setOverlayContent] = useState();
  const recorder = new Workout();
  return (
    <WorkoutPostStats recorder={recorder}/>
  );
}