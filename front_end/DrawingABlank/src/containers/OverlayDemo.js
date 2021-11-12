/**
 * OverlayDemo container
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {Button, StyleSheet, View} from 'react-native';
import Overlay from './Overlay';
import EventDetails from '../components/events/EventDetails';
import ExampleOverlay from '../components/events/ExampleOverlay';

const OverlayDemo = (): Node => {
  const exampleEvent = (
    <EventDetails
      eventType={'Running'}
      timeRemaining={'XX:XX:XX'}
      radius={'XX miles'}
      notes={'Blah blah event notes\nSafety notices etc'}
    />
  );

  const exampleExampleOverlay = <ExampleOverlay content={'test'} />;

  const [overlayVisible, setOverlayVisible] = useState(false);
  // use setOverlayContent to change the content of the overlay
  const [overlayContent, setOverlayContent] = useState(exampleEvent);

  return (
    <View>
      {/* This button will set the overlay to visible and show the event detail overlay*/}
      <Button
        title={'show event'}
        onPress={() => {
          setOverlayContent(exampleEvent);
          setOverlayVisible(true);
        }}
      />
      {/* This button will set the overlay to visible and show the */}
      <Button
        title={'show example overlay'}
        onPress={() => {
          setOverlayContent(exampleExampleOverlay);
          setOverlayVisible(true);
        }}
      />
      {/* show a simple example overlay showing sample event details*/}
      <Overlay
        visible={overlayVisible}
        setVisible={setOverlayVisible}
        children={overlayContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default OverlayDemo;
