import React, {useState} from 'react';
import {View, Button} from 'react-native';
import AbsoluteComponent from '../hocs/AbsoluteComponent';
import {Icon} from 'react-native-elements';

import {styles} from './style.js';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function MapControls({
  toggleGhostMode,
  startWorkout,
  toggleShowEventsList,
  workoutText,
  drawGridsFunction,
  workout_active,
  ghost_active
}) {
  toggle_workout = () => startWorkout();

  return (
    <AbsoluteComponent style={{bottom: 70, elevation: 0}}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity>
          {(ghost_active) ? <Icon
            name={'eye-off'}
            type={'feather'}
            // iconStyle={styles.icon}
            // containerStyle={styles.menu}
            size={30}
            onPress={toggleGhostMode}
          /> : <Icon
            name={'eye'}
            type={'feather'}
            size={30}
            onPress={toggleGhostMode}
          />}
        </TouchableOpacity>
        <TouchableOpacity>
          {workout_active ? (
            <Icon
              name={'pause'}
              type={'feather'}
              iconStyle={styles.paused}
              // containerStyle={styles.menu}
              size={30}
              onPress={toggle_workout}
            />
          ) : (
            <Icon
              name={'play'}
              type={'feather'}
              // iconStyle={styles.icon}
              // containerStyle={styles.menu}
              size={30}
              onPress={toggle_workout}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon
            name={'award'}
            type={'feather'}
            // iconStyle={styles.icon}
            // containerStyle={styles.menu}
            size={30}
            onPress={toggleShowEventsList}
          />
        </TouchableOpacity>

        {/* <Button
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
          onPress={toggleShowEventsList}></Button> */}
        {/* Want a re-centre button, show path as data points button  */}
      </View>
      {/* <View style={{top: 20, alignItems: 'center'}}>
        <Button
          title={'Refresh'}
          style={styles.button}
          onPress={drawGridsFunction}></Button>
      </View> */}
    </AbsoluteComponent>
  );
}
