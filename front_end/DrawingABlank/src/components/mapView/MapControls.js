import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  Alert,
} from 'react-native';
import AbsoluteComponent from './AbsoluteComponent';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {},
});

export default function MapControls({}) {
  return (
    <AbsoluteComponent style={{bottom: 70}}>
      <View style={styles.container}>
        <Button title={'Ghost Mode'} style={styles.button}></Button>
        <Button title={'Start Workout'} style={styles.button}></Button>
        <Button title={'See Events'} style={styles.button}></Button>
      </View>
    </AbsoluteComponent>
  );

  function generateButton(title, onPress, style) {
    return <Button title={title} onPress={onPress} style={style} />;
  }
}
