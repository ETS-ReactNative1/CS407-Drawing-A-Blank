import React from 'react';
import {View} from 'react-native';

export default function AbsoluteComponent(props) {
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center',
        ...props.style,
      }}>
      {props.children}
    </View>
  );
}

//src: https://stackoverflow.com/questions/37317568/react-native-absolute-positioning-horizontal-centre
