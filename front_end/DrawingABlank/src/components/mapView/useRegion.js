import {useEffect, useState} from 'react';
import {useDidUpdateEffect} from '../hooks/useDidUpdateEffect';
import useGeoLocation from './useGeoLocation';
import useZoomLevel from './useZoomLevel';

// issue perhaps of region not being set for first load
// due to geolocation async update

// Since region is related only to the map
// should probably use all map state hooks in this file
// export a single "region" for the map
// with all the tiles on it

export default function useRegion() {
  const userLocation = useGeoLocation();
  const [zoomLevel, tileSize] = useZoomLevel();
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  useEffect(() => {
    console.log('setting region', zoomLevel.current);
    setRegion(buildRegion(userLocation.current, zoomLevel.current));
  }, [tileSize]);

  useDidUpdateEffect(() => {
    console.log('set region', userLocation.current, zoomLevel.current);

    uLoc = userLocation.current;
    zl = zoomLevel.current;

    r = buildRegion(userLocation.current, zoomLevel.current);

    setRegion(r);
  }, [userLocation.current]);

  const buildRegion = (location, zoomlevel) => {
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      longitudeDelta: zoomlevel.longitudeDelta,
      latitudeDelta: zoomlevel.latitudeDelta,
    };
  };

  return [region, setRegion];
}
