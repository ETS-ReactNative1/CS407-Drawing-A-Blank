import React, {useRef, useState} from 'react';
import {Workout} from '../workout_recording/workout';
import setupGeolocation, {getCurrentPosition} from './geoLocation';
import {useEffect} from 'react';
import {Polyline} from 'react-native-maps';

import locationConfig from './constants';
import useGeoLocation from './useGeoLocation';
import PushNotification from 'react-native-push-notification';

var recorder = new Workout();

const USER_DRAW_DIAMETER = 1; // metres
const USER_INK_COLOUR = 'rgba(0, 255, 0, 0.75)';

export default function useUserPath(isTracking) {
  const [userPath, setUserPath] = useState([]);
  const workout_active = useRef(false);

  const userLocation = useGeoLocation();

  // init location listener
  useEffect(() => {
    //recorder.coordinates;
    recorder = new Workout();
    setupGeolocation(userLoc => {
      // Add every detected user location to path, conditionally on tracking
      console.log('movement');
      addPathPoint(userLoc, isTracking);
    }, locationConfig);
    return () => {PushNotification.cancelAllLocalNotifications()};
  }, []);

  function clearPath() {
    setUserPath([]);
  }

  const startWorkout = type => {
    console.log('Starting Workout...');
    clearPath();
    workout_active.current = true;
    recorder.startWorkout(type);
    getCurrentPosition(({longitude, latitude}) => {
      recorder.addCoordinate(latitude, longitude);
    });
  };

  function stopWorkout() {
    console.log('Stopping Workout...');
    recorder.stopWorkout();
    workout_active.current = false;
    clearPath();
  }

  function DrawUserPath() {
    if (workout_active) {
      // console.log('drawing path,', userPath);
      return (
        <Polyline
          coordinates={userPath}
          strokeWidth={3 || USER_DRAW_DIAMETER}
          strokeColor={USER_INK_COLOUR}
        />
      );
    } else {
      return false;
    }
  }

  function addPathPoint(latLngPoint, isTracking) {
    // add latlng point to path - only if tracking mode enabled
    if (workout_active.current) setUserPath(path => [...path, latLngPoint]);

    // add point to workout recorder / exercise computer
    recorder.addCoordinate(
      latLngPoint.latitude,
      latLngPoint.longitude,
      isTracking,
    );
  }

  function toggleWorkout(changeToStats, type) {
    console.log('worlout active:', workout_active.current, type);
    if (!workout_active.current) {
      startWorkout(type);
    } else {
      stopWorkout();
      changeToStats(recorder);
    }
  }

  return [DrawUserPath, toggleWorkout, workout_active];
}

// or make it a component
// then pass props
// control the props using...
