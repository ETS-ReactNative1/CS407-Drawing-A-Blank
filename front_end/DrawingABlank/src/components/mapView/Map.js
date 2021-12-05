import React, {useState, useEffect, useRef} from 'react';
import {View} from 'react-native';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
  Animated,
  Polygon,
} from 'react-native-maps';
import {getDistance} from 'geolib';
import Geolocation from 'react-native-geolocation-service';
import MapControls from './MapButtons';
import Sheet from '../bottomSheet/Sheet';
import {requestLocationPermission} from './permissions';
import {getInitialStateAnimated as getInitialState} from './testData';
import {getEvents} from '../../api/api_events';

import {styles} from './style.js';
import EventDetails from '../events/EventDetails';
import ExampleMarkers from '../events/resources/ExampleMarkers';
import { Workout } from '../workout_recording/workout';

const recorder = new Workout();
const MAP_ZOOMLEVEL_CLOSE = {latitudeDelta: 0.005, longitudeDelta: 0.005};
const MAP_ZOOMLEVEL_FAR = {latitudeDelta: 0.0922, longitudeDelta: 0.0421};
const USER_INK_COLOUR = 'blue';

function Map({setOverlayVisible, setOverlayContent}) {
  const [region, setRegion] = useState(getInitialState().region);
  //const [markers, setMarkers] = useState([]);
  //const [colourSpaces, setColourSpaces] = useState(
  //  getInitialState().colourSpaces,
  //); //getInitialState().colourSpaces)

  
  const workout_button_start = "Start Workout";
  const workout_button_stop = "Stop Workout";

  const [workout_button_text, set_workout_button_text] = useState(workout_button_start);
  const [workout_active, set_workout_active] = useState(false);

  const [events, setEvents] = useState([]);
  const bottomSheetRef = useRef(null);
  function onRegionChange(region) {
    setRegion(region);
  }

  function drawInk(){
    return events.map(space => 
      <Polygon
            coordinates={space.bounds.coordinates}
            strokeColor={space.bounds.strokeColor}
            fillColor={space.bounds.fillColor}
            strokeWidth={space.bounds.strokeWidth}
            key={'Space'+space.bounds.id}
        />
    );
  }

  function drawMarkers() {
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
        onPress={() =>{
            var current_date = new Date();
            var event_date = Date.parse(event.date_end);
            var time_left = event_date - current_date;
            console.log(current_date);
            console.log(event.date_end);
            var hours = Math.floor(time_left/(1000*3600));
            var minutes = Math.floor(time_left/(1000*60)) % 60;
            var seconds = Math.floor(time_left/(1000)) % 60;
            onEventPress(
              'Running event #' + event.id,
              hours + ':' + minutes + ':' + (seconds < 10 ? '0' + seconds : seconds),
              'X',
              event.description,
            )
          }
        }
      />
    ));
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

  useEffect(() => {
    // Get User permission for location tracking, and initialize map to listen
    // if user permission not given, map will default to initial state - could change to anything e.g. dont render map at all nd show hser dialog
    // (logic could be moved to "withPermissions" hoc)1
    setupGeolocation(({latitude, longitude}) => {
      const zoomLevel = MAP_ZOOMLEVEL_CLOSE;
      setRegion({
        //...region, //take previous zoom level
        ...zoomLevel, //take zoom level from constant
        latitude,
        longitude,
      });
    });
    //This will get the events through the API, then update the events state.
    getEvents().then(result => setEvents(result));
  }, []);

  return (
    <View style={styles.mapContainer}>
      <Animated
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        mapType={'standard'}>
        {drawMarkers()}
        {drawInk()}
      </Animated>

      <MapControls
        toggleGhostMode={() => {
          console.log('Enabling Ghost mode...');
        }}
        toggleShowEventsList={() => {
          console.log('Opening Events Bottom Tray...');
          bottomSheetRef.current.expand();
        }}
        startWorkout={() => {
          if(!workout_active){
            console.log('Starting Workout...');
            recorder.startWorkout();
            Geolocation.getCurrentPosition(({coords}) => recorder.addCoordinate(coords.latitude,coords.longitude));
            set_workout_active(true);
            set_workout_button_text(workout_button_stop);
          }else{
            console.log('Stopping Workout...');
            recorder.stopWorkout();
            set_workout_active(false);
            set_workout_button_text(workout_button_start);
          }
        }}
        workoutText={workout_button_text}
      />
      <Sheet
        ref={bottomSheetRef}
        // should definitely be sorted - probably when I have "real" data from backend
        localEvents={events}
        onEventClick={eventRegion =>
          setRegion({...MAP_ZOOMLEVEL_CLOSE, ...eventRegion})
        }
        // will probably need to redo how this works too at the same time
        calculateDistanceToUser={dest => {
          return getDistance(
            {longitude: region.longitude, latitude: region.latitude},
            dest,
          );
        }}
      />
    </View>
  );
}

const setupGeolocation = async _setRegion => {
  if ((await requestLocationPermission()).grantedStatus) {
    // Init Map to users current location
    Geolocation.getCurrentPosition(({coords}) => _setRegion(coords));

    // Listen for user movement, update map accordingly
    const watchId = Geolocation.watchPosition(
      ({coords}) => {
        _setRegion(coords);
        if(recorder.recording){
          recorder.addCoordinate(coords.latitude,coords.longitude);
        }
      },
      e => {
        console.log(e);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );

    return () => {
      Geolocation.clearWatch(watchId);
    };
  } else {
    console.log('User Permission for Location DENIED');
  }
};

export default Map;
