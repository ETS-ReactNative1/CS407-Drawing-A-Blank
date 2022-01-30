import React, {useEffect, useRef, useState} from 'react';
import {getEvents} from '../../api/api_events';
import useGeoLocation from './useGeoLocation';
import {Marker, Polygon, Circle} from 'react-native-maps';

import Cache from './SimpleCache';
export default function useEvents(initZoom, initEvents, {useCache} = {}) {
  const userLocation = useGeoLocation(); //state
  const zoomLevel = useRef(initZoom); // type RNM

  const [events, setEvents] = useState([]);
  const eventCache = useRef(new Cache({}));

  useEffect(() => {
    getEvents().then(result => setEvents(result || []));
  }, []);

  function DrawEventsBounds() {
    return events.map((space, i) => {
      if (!space.radius) {
        return (
          <Polygon
            coordinates={space.bounds.coordinates}
            strokeColor={space.bounds.strokeColor}
            fillColor={space.bounds.fillColor}
            strokeWidth={space.bounds.strokeWidth}
            key={i}
          />
        );
      } else {
        return (
          <Circle
            center={space.bounds.center}
            radius={space.bounds.radius}
            fillColor={space.bounds.fillColor}
            strokeWidth={0}
            key={i}
          />
        );
      }
    });
  }

  function DrawEventsMarkers() {
    return events.map(event => (
      <Marker
        key={event.id}
        coordinate={event.marker}
        title={event.title}
        anchor={{x: 0, y: 1}}
        description={event.description}
        image={{
          uri: 'http://clipart-library.com/data_images/165937.png',
        }}
        onPress={() => {
          var current_date = new Date();
          var event_date = Date.parse(event.date_end);
          var time_left = event_date - current_date;
          console.log(current_date);
          console.log(event.date_end);
          var hours = Math.floor(time_left / (1000 * 3600));
          var minutes = Math.floor(time_left / (1000 * 60)) % 60;
          var seconds = Math.floor(time_left / 1000) % 60;
          onEventPress(
            'Running event #' + event.id,
            hours +
              ':' +
              minutes +
              ':' +
              (seconds < 10 ? '0' + seconds : seconds),
            event.description,
          );
        }}
      />
    ));
  }

  function DrawEvents() {
    const draw = [...DrawEventsBounds(), ...DrawEventsMarkers()];
    return draw;
  }

  return [DrawEvents, events];
}
