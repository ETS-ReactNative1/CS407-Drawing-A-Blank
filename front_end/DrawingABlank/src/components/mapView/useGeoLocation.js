import {useState, useEffect, useRef} from 'react';
import setupGeolocation, {clearWatch, getCurrentPosition} from './geoLocation';

const locationConfig = {
  enableHighAccuracy: true,
  timeout: 200, // max time for location request duration
  maximumAge: 1000, // max age before it will refresh cache
  distanceFilter: 5, // min moved distance before next data point
};

export default function useGeoLocation(callback) {
  // const location = useRef({latitude: 0, longitude: 0}); -> by using ref, map wont snap to user location when moving
  const location = useRef({latitude: 0, longitude: 0});
  watchId = useRef(-1);

  useEffect(() => {
    async function handleGeoLocation() {
      const {ID} = await setupGeolocation(userLocation => {
        // Listens to userlocation changes
        // setLocation(userLocation);
        location.current = userLocation;
        callback ? console.log('true clb') : console.log('false clb');
        if (callback) callback(userLocation);
      }, locationConfig);
      watchId.current = ID;
    }

    handleGeoLocation();

    return () => clearWatch(watchId.current);
  }, []);

  return location;
}
