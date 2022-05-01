import React, {useEffect, useCallback, useMemo, forwardRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Button} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import EventListComponent from './EventListComponent';

const Sheet = forwardRef(
  ({localEvents, calculateDistanceToUser, onEventClick, DrawEventDetails}, ref) => {
    const snapPoints = useMemo(() => ['50%'], []);

    const handleSheetChanges = useCallback(index => {
      console.log('handleSheetChanges', index);
    }, []);

    return (
      // <View /*pointerEvents={'none'}*/ style={styles.container}>
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
        style={styles.container}>
        <View style={styles.contentTitle}>
          <Text>{localEvents.length} Events Near You</Text>
        </View>
        <BottomSheetScrollView contentContainerStyle={styles.scrollContainer}>
          {localEvents.map(event => (
            <EventListComponent
              key={event.id}
              onEventClick={onEventClick}
              event={event}
              distance={calculateDistanceToUser(event.marker)}
              DrawEventDetails={() => {
                var current_date = new Date();
                var event_date = Date.parse(event.date_end);
                var time_left = event_date - current_date;
                console.log(current_date);
                console.log(event.date_end);
                var hours = Math.floor(time_left / (1000 * 3600));
                var minutes = Math.floor(time_left / (1000 * 60)) % 60;
                var seconds = Math.floor(time_left / 1000) % 60;
                DrawEventDetails(
                  'Event #' + event.id,
                  hours +
                    ':' +
                    minutes +
                    ':' +
                    (seconds < 10 ? '0' + seconds : seconds),
                  event.description,
                  event.id
                )}
            }
            />
          ))}
        </BottomSheetScrollView>
      </BottomSheet>
      //</View>
    );
  },
);

export default Sheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    elevation: 10,
    zIndex: 10,
    marginHorizontal: 16,
    marginTop: 50,
    position: 'absolute',
  },
  contentTitle: {
    alignItems: 'center',
    height: 30,
  },
  eventContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventHeader: {
    fontSize: 20,
  },
  scrollContainer: {
    top: 0,
    backgroundColor: 'white',
    paddingBottom: 55,
  },
});
