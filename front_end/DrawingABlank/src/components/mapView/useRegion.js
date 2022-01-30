import {useState} from 'react';
import {useDidUpdateEffect} from '../hooks/useDidUpdateEffect';
import useGeoLocation from './useGeoLocation';

// issue perhaps of region not being set for first load
// due to geolocation async update

// Since region is related only to the map
// should probably use all map state hooks in this file
// export a single "region" for the map
// with all the tiles on it

export default function useRegion() {
  const userLocation = useGeoLocation();
  const [region, setRegion] = useState();

  useDidUpdateEffect(() => {
    setRegion(userLocation.current);
  }, [userLocation.current]);

  return [region, setRegion];
}
