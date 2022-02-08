import {useEffect, useRef, useState} from 'react';
import {useDidUpdateEffect} from '../hooks/useDidUpdateEffect';
import useGeoLocation from './useGeoLocation';

// issue perhaps of region not being set for first load
// due to geolocation async update

// Since region is related only to the map
// should probably use all map state hooks in this file
// export a single "region" for the map
// with all the tiles on it

// will need to do mercator projection to make same size window globlly
const BUFFER_ZOOM_LEVEL = {
  latitudeDelta: 0.6039001489487674,
  longitudeDelta: 0.5393288657069206,
};

const INIT_ZOOM = {
  latitudeDelta: 0.6039001489487674,
  longitudeDelta: 0.5393288657069206,
};

// "What is the user looking at"
export default function useRegion() {
  const deviceLocation = useGeoLocation();
  // const [zoomLevel, tileSize] = useZoomLevel();

  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [bufferedRegion, setBufferedRegion] = useState(region); // detaches map render zone from map view zone (probbaly only need one as state)
  const [zoomLayer, setZoomLayer] = useState(1);

  // Set region to device location
  // should be predifined zoom level here
  // "first load zoom level"
  // should now be unneesary - why?

  useDidUpdateEffect(() => {
    uLoc = deviceLocation.current;

    r = buildRegion(deviceLocation.current);
    // updateRegion(r);
    console.log('set region', r);

    setRegion(r);
  }, [deviceLocation.current]);

  const buildRegion = (location, zoomlevel) => {
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      ...INIT_ZOOM,
    };
  };

  // const [regionZoom, setRegionZoom] = useState();
  // const [regionLocation, setRegionLocation] = useState();

  // use debounce when being called to reduce spam on big pans
  // updateRegion - accepts a region and checks to see if its out of current cache bounds
  // if it is, need to get new map data, re render .
  const updateRegion = r => {
    const zoom = {
      latitudeDelta: r.latitudeDelta,
      longitudeDelta: r.longitudeDelta,
    };
    const location = {latitude: r.latititude, longitude: r.longitude};

    // only if zoom changed by more than cache entry size
    //    useLocalZoom conditions

    // only if location changed by more than the current cache width/height for this zoom level

    // all caches will be synced to zoom level and location change
    // if they choose to be useffect, and usecallback - stops pointless reprocessing on not-lisyened to state change

    // Limiting map re renders to
    //    when map zoom changes
    //    when map pan is wider than current region +- some range
    // To be used ultimatly in causing map content to be re drawn
    // depending on the two above conditions
    //    which can be ignored or not in the relevant hook (useEffect) to reduce re renders
    //      - but still causes at least 1 re render per state change in this file

    // should probably try to find existing regions first
    const getBestBufferRegion = (viewWindow, viewZoom) => {
      const getCorners = (lat, long, dLat, dLong) => {
        dLat = dLat;
        dLong = dLong;
        const bottomLeft = {
          latitude: lat - dLat / 2,
          longitude: long - dLong / 2,
        };

        const topRight = {
          latitude: lat + dLat / 2,
          longitude: long + dLong / 2,
        };

        return [bottomLeft, topRight];
      };

      // change to same area per grid cache entry
      // from getting grids at distance away from user dependent on zoom level
      //    i.e. if they were zoomed in, collect fewer grids than if zoomed out
      //    now, both zoom levels have same number of grids
      // done to make bound checking easier

      // Check if pannned to region "window" is outside the current (buffered) render window

      // Buffere render window - the latlng area of the current region
      //    will need "bufferdRegion" and "viewRegion" to differentiate

      // if bottom left point past buffered bottom left point (lat and lng)
      //    is out of bounds - set bufferedLocation state

      const {latitude, longitude} = viewWindow;
      const {latitudeDelta, longitudeDelta} = viewZoom;

      const {
        latitude: latBuf,
        longitude: longBuf,
        latitudeDelta: dLatBuff,
        longitudeDelta: dLongBuff,
      } = bufferedRegion;

      // buffered deltas can be used if want to have a buffer region size per zoom
      // for now just constant width bufferRegion regardless of zoom

      const [bottomLeft, topRight] = getCorners(
        latBuf,
        longBuf,
        dLatBuff,
        dLongBuff,
      );

      // if outside the buffered region
      //  - considers only view position, not field of view
      //      when determining is outside the buffered region

      if (
        latitude > topRight.latitude ||
        latitude < bottomLeft.latitude ||
        longitude > topRight.longitude ||
        longitude < bottomLeft.longitude
      ) {
        // return new bounded region centre point
        return [{...viewWindow, ...BUFFER_ZOOM_LEVEL}, 1];
      }
      return [bufferedRegion, 0]; // might still cause re render - react probably doesnt deep compare
    };

    // key in cahce needs changing so i know to refersh cache on pan

    // this is required otherwise refresh will set map view location to default on re render
    // dont want it always being ran - will kill perforamnce on pan
    // setRegionLocation(location);

    // find if the user is looking outside the "rendered region box" - for loading in events around the user window
    const [bufRegion, isNewRegion] = getBestBufferRegion(location, zoom);

    // find if the user has change zoom layer - for listenting to zoom changes
    const [zLayer, isNewZoomLayer] = convertDeltaToZLayer(zoom);

    // only actually re renders when a state changes - workaround to react shallow state comparison
    if (isNewRegion || isNewZoomLayer) {
      // "backup" the currently viewed region
      //    so it doesnt snap back on re render
      setRegion(r);

      if (isNewZoomLayer) {
        setZoomLayer(zLayer);
      }

      // update buffer area if userview is outside it
      if (isNewRegion) {
        setBufferedRegion(bufRegion);
      }
    }
  };

  const convertDeltaToZLayer = latlng => {
    dLat = latlng['latitudeDelta'];

    layer = 1;

    if (dLat < 0.00029) {
      layer = 1;
    } else if (dLat < 0.0024) {
      layer = 2;
    } else if (dLat < 0.0089) {
      layer = 3;
    } else if (dLat < 0.4) {
      layer = 4;
    } else if (dLat < 0.3) {
      layer = 5;
    } else {
      layer = 6;
    }

    if (layer == zoomLayer) {
      return [layer, 0];
    } else {
      return [layer, 1];
    }
  };

  // trying to set region when tile size changes (OLD)
  // useEffect(() => {
  //   console.log('setting region', zoomLevel.current);
  //   setRegion(buildRegion(userLocation.current, zoomLevel.current));
  // }, [tileSize]);

  return [region, updateRegion, bufferedRegion, zoomLayer];
}
