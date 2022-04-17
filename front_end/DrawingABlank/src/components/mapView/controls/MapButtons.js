import React, {useState} from 'react';
import {View, Button} from 'react-native';
import AbsoluteComponent from '../../hocs/AbsoluteComponent';
import {Icon} from 'react-native-elements';

import {styles} from '../style.js';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default function MapControls({
  toggleGhostMode,
  toggleWorkout,
  toggleShowEventsList,
  workout_active,
  ghost_inactive,
}) {
  
  return (
    <>
      <TouchableOpacity style={styles.settings_button}>
        <Icon name={'cog'} type={'material-community'} size={30}></Icon>
      </TouchableOpacity>

      <AbsoluteComponent style={{bottom: 70, elevation: 0}}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity>
            {ghost_inactive ? (
              <Icon
                name={'ghost-off-outline'}
                type={'material-community'}
                // iconStyle={styles.icon}
                // containerStyle={styles.menu}
                size={30}
                onPress={toggleGhostMode}
              />
            ) : (
              <Icon
                name={'ghost-outline'}
                type={'material-community'}
                size={30}
                onPress={toggleGhostMode}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            {workout_active ? (
              <Icon
                name={'pause'}
                type={'feather'}
                iconStyle={styles.paused}
                // containerStyle={styles.menu}
                size={30}
                onPress={toggleWorkout}
              />
            ) : (
              <Icon
                name={'play'}
                type={'feather'}
                // iconStyle={styles.icon}
                // containerStyle={styles.menu}
                size={30}
                onPress={toggleWorkout}
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
    </>
  );
}
