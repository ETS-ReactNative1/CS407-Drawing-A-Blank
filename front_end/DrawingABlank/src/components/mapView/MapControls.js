import React from 'react';
import {View, Button} from 'react-native';
import AbsoluteComponent from './AbsoluteComponent';

import {styles} from './style.js';

export default function MapControls({}) {
  return (
    <AbsoluteComponent style={{bottom: 70}}>
      <View style={styles.buttonContainer}>
        <Button title={'Ghost Mode'} style={styles.button}></Button>
        <Button title={'Start Workout'} style={styles.button}></Button>
        <Button title={'See Events'} style={styles.button}></Button>
      </View>
    </AbsoluteComponent>
  );
}
