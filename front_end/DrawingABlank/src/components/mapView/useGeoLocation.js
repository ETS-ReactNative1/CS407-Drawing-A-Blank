import {useState, useEffect, useRef} from 'react';

import setupGeolocation, {clearWatch} from './geoLocation';

const locationConfig = {
  enableHighAccuracy: true,
  timeout: 200, // max time for location request duration
  maximumAge: 1000, // max age before it will refresh cache
  distanceFilter: 5, // min moved distance before next data point
};

export default function useGeoLocation() {
  // const location = useRef({latitude: 0, longitude: 0}); -> by using ref, map wont snap to user location when moving
  const [location, setLocation] = useState({latitude: 0, longitude: 0});
  watchId = useRef(-1);

  useEffect(() => {
    async function handleGeoLocation() {
      const {ID} = await setupGeolocation(userLocation => {
        // Listens to userlocation changes
        setLocation(userLocation);
        //location.current = userLocation;
      }, locationConfig);
      watchId.current = ID;
    }

    handleGeoLocation();

    return () => clearWatch(watchId.current);
  }, []);

  return location;
}
