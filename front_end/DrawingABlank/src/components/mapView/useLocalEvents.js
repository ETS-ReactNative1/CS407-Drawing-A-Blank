import React, {useEffect, useRef, useState, useCallback} from 'react';
import {getEvents} from '../../api/api_events';
import useGeoLocation from './useGeoLocation';
import {Marker, Polygon, Circle} from 'react-native-maps';
import EventDetails from '../events/EventDetails';

import Cache from './SimpleCache';
export default function useEvents(
  initEvents,
  {renderRegion, zoomLayer},
  {useCache, setOverlayVisible, setOverlayContent} = {},
) {
  const [events, setEvents] = useState([]);
  const eventCache = useRef(new Cache({}));

  useEffect(() => {
    console.log('updatng local events');
    getEvents().then(result => setEvents(result || []));
  }, []);

  useEffect(() => {
    collectEventScores();
  }, [renderRegion]);

  function collectEventScores() {
    console.log('CALCULATING SCORES');
    console.log('HAVE EVENTS:' + events);
    result = {};
    events.forEach(event => {
      console.log('GOT EVENT:' + JSON.stringify(event));
      var eventScore = getEventScores(grids, event['bounds']['coordinates']);
      if (eventScore.length != 0) {
        converted_result = [];
        eventScore.forEach(score => {
          converted_result.push({
            title: score['details']['team'],
            picture: score['details']['picture'],
            points: score['count'],
          });
        });
        result[event.id] = converted_result;
      }
    });
    //TODO FIX EVENT SCORES
    //setEventScores(result);
    console.log(result);
  }

  function onEventPress(type, time, radius, desc) {
    // eventType, timeRemaining, radius, desc
    setOverlayContent(
      <EventDetails
        eventType={type}
        timeRemaining={time}
        radius={radius}
        desc={desc}
      />,
    );
    setOverlayVisible(true);
  }

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
        /* anchor={{x: 0, y: 1}} */
        description={event.description}
        /* image={{
          uri: 'http://clipart-library.com/data_images/165937.png',
        }} */
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
  // return [useCallback(DrawEvents, [events]), events];
}
