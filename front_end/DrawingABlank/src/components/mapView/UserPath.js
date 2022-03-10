import React, {useRef, useState} from 'react';
import {Workout} from '../workout_recording/workout';
import useGeoLocation from './useGeoLocation';

const recorder = new Workout();

function UserPath(isTracking) {
  const userLocation = useGeoLocation();
  const [userPath, setUserPath] = useState();
  userPathRef = useRef();

  useEffect(() => {
    const {latitude, longitude} = userLocation.current;
    const oldUserPath = userPathRef.current;
    recorder.addCoordinate(latitude, longitude);

    //draw new user movement polygon - map their travelled path
    userPathRef.current = [...oldUserPath, {latitude, longitude}];
    setUserPath(userPathRef.current);

    return () => {};
  }, [userLocation.current]); // not a state - relies on other state changes to see locaiton changes

  DrawUserPath = () => {};

  addPathPoint = () => {};

  return [DrawUserPath, addPathPoint];
}

// or make it a component
// then pass props
// control the props using...
