import React, {Fragment, useState} from 'react';
import {View, Button} from 'react-native';
import AbsoluteComponent from '../../hocs/AbsoluteComponent';
import {Icon} from 'react-native-elements';

import {styles} from '../style.js';
import {TouchableOpacity} from 'react-native-gesture-handler';

import ModalSelector from 'react-native-modal-selector';

export default function MapControls({
  toggleGhostMode,
  toggleWorkout,
  toggleShowEventsList,
  toggleSidebar,
  refresh_map,
  workout_active,
  ghost_inactive,
}) {
  toggle_workout = () => startWorkout();

  const workout_choices = [
    //Check the workout API choices with back-end
    {key: 0, label: 'Walking', customKey: 'walk'},
    {key: 1, label: 'Running', customKey: 'run'},
    {key: 2, label: 'Cycling', customKey: 'cycle'},
  ];
  var option_selected = 'walk';

  return (
    <Fragment>
      <AbsoluteComponent style={{left: -20, top: 10}}>
        <View style={styles.small_buttonContainer}>
          <TouchableOpacity>
            <Icon name={'menu'} type={'feather'} onPress={toggleSidebar}></Icon>
          </TouchableOpacity>
        </View>
      </AbsoluteComponent>
      <AbsoluteComponent style={{left: -20, top: 60}}>
        <View style={styles.small_buttonContainer}>
          <TouchableOpacity>
            <Icon
              name={'refresh-cw'}
              type={'feather'}
              onPress={refresh_map}></Icon>
          </TouchableOpacity>
        </View>
      </AbsoluteComponent>
      <AbsoluteComponent style={{bottom: 70, elevation: 0}}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity>
            {ghost_inactive ? (
              <Icon
                name={'eye-off'}
                type={'feather'}
                // iconStyle={styles.icon}
                // containerStyle={styles.menu}
                size={30}
                onPress={toggleGhostMode}
              />
            ) : (
              <Icon
                name={'eye'}
                type={'feather'}
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
                onPress={toggleWorkout} // stop workout (change to stats, -1)
              />
            ) : (
              <ModalSelector
                data={workout_choices}
                ref={selector => (this.selector = selector)}
                customSelector={
                  <Icon
                    name={'play'}
                    type={'feather'}
                    size={30}
                    onPress={() => this.selector.open()}
                  />
                }
                onChange={option => {
                  this.option_selected = option.customKey;
                  toggleWorkout(this.option_selected);
                }}
              /> // start workout(-1, type)
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
    </Fragment>
  );
}
