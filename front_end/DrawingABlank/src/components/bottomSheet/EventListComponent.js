import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import EventButtons from './EventButtons';

const EventListComponent = ({event, onEventClick, distance}) => {
  return (
    <>
      <TouchableOpacity
        key={event.id}
        onPress={() => onEventClick(event.marker)}>
        <View style={styles.eventListItemContainer}>
          <View style={styles.eventTextContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.eventHeader}>
              {event.title}
            </Text>
            <Text numberOfLines={2} ellipsizeMode="tail">
              {event.description}
            </Text>
            <Text style={styles.text__distance}> {distance} kilometres</Text>
          </View>
          <EventButtons style={styles.buttonsContainer} />
        </View>
      </TouchableOpacity>
    </>
  );
};

export default EventListComponent;

const styles = StyleSheet.create({
  buttonsContainer: {flex: '1 1 1'},
  text__distance: {marginLeft: 10, marginTop: 5},
  container: {
    flex: 1,
    padding: 4,
    elevation: 10,
    zIndex: 10,
    marginHorizontal: 16,
    marginTop: 50,
    position: 'absolute',

    //backgroundColor: 'gray',
  },
  contentTitle: {
    alignItems: 'center',
    height: 30,
  },
  eventTextContainer: {
    overflow: 'hidden',
    flex: 2,
  },
  eventListItemContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: 'gray',
    margin: 3,
    borderWidth: 1,
    borderRadius: 5,
  },
  eventHeader: {
    fontSize: 20,
  },
  scrollContainer: {
    top: 0,
    backgroundColor: 'white',
  },
});
