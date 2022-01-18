import React from 'react';
import {View, Button} from 'react-native';
import AbsoluteComponent from '../hocs/AbsoluteComponent';

import {styles} from './style.js';

export default function MapControls({
  toggleGhostMode,
  startWorkout,
  toggleShowEventsList,
  workoutText,
  drawGridsFunction
}) {
  return (
    <AbsoluteComponent style={{bottom: 70, elevation: 0}}>
      <View style={styles.buttonContainer}>
        <Button
          title={'Ghost Mode'}
          style={styles.button}
          onPress={toggleGhostMode}></Button>
        <Button
          title={workoutText}
          style={styles.button}
          onPress={startWorkout}></Button>
        <Button
          title={'See Events'}
          style={styles.button}
          onPress={toggleShowEventsList}></Button>
        {/* Want a re-centre button, show path as data points button  */}
      </View>
      <View style={{top:20, alignItems:"center"}}>
      <Button
          title={'Refresh'}
          style={styles.button}
          onPress={drawGridsFunction}></Button>
      </View>
    </AbsoluteComponent>
  );
}
