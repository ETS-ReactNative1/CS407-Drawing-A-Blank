/**
 * Overlay container
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const Overlay = ({visible, setVisible, children}): Node => {
  return (
    <Modal visible={visible} transparent={true} animationType={'slide'}>
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => {
            console.log('pressed');
            setVisible(false);
          }}>
          <Text style={{color: '#ff0000', fontSize: 20}}>X</Text>
        </TouchableOpacity>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: '20%',
    height: '130%',
    // marginLeft: '15%',
    // marginRight: '15%',
    // width: '70%',
    flexDirection: 'column',
    borderColor: '#000000',
    borderWidth: 0.9,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  closeButton: {
    width: '10%',
    alignItems: 'center',
    padding: 5,
    paddingBottom: 0,
    marginBottom: -20,
    marginLeft: '90%',
  },
  content: {
    alignItems: 'flex-start',
  },
});

export default Overlay;
