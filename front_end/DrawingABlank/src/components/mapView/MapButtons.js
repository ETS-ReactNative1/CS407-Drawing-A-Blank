import React from 'react';
import {View, Button} from 'react-native';
import AbsoluteComponent from '../hocs/AbsoluteComponent';

import {styles} from './style.js';

export default function MapControls({
  toggleGhostMode,
  startWorkout,
  toggleShowEventsList,
}) {
  return (
    <AbsoluteComponent style={{bottom: 70}}>
      <View style={styles.buttonContainer}>
        <Button
          title={'Ghost Mode'}
          style={styles.button}
          onPress={toggleGhostMode}></Button>
        <Button
          title={'Start Workout'}
          style={styles.button}
          onPress={startWorkout}></Button>
        <Button
          title={'See Events'}
          style={styles.button}
          onPress={toggleShowEventsList}></Button>
      </View>
    </AbsoluteComponent>
  );
}
