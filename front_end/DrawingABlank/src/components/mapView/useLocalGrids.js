import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {getGrids} from '../../api/api_grids';
import useGeoLocation from './useGeoLocation';
import Cache from './SimpleCache';
import {Polygon} from 'react-native-maps';
import {createEmptyStatement} from 'typescript';
import {useDidUpdateEffect} from '../hooks/useDidUpdateEffect';
import useZoomLevel from './useZoomLevel';
//import staticLoDs from './LoDs';

// similar hooks can be build for each large state e.g. markers/events
// giving each access to zoomlevel and user location if they need it

// option to use cache - prevents backend multiple spammed requests e.g. by rapid zooming in and out
// Has to be applied in buckets - will result in "popping in" of grids effect whilst panning across a bucket boundary

// use test data: make a random polygon, get it to change with zoom distance
// loadinto cache, to test cache
// fetch and display a range of cache entries based on zoom level
// at least log the trigger

const gridZoomCache = new Cache({});

export default function useLocalGrids(initGrids = [], {useCache = 0} = {}) {
  const [_, _, bufferedRegion, zoomLayer] = useRegion();
  const userLocation = useGeoLocation();
  const [localGrids, setLocalGrids] = useState(initGrids);

  useEffect(() => {
    // clear cache
    //  if only want to cache for zoom level
  }, [bufferedRegion]);

  useEffect(() => {
    //clear caache
    //  if only want to cache for region
  }, [zoomLayer]);

  function buildCacheEntry(
    {latitude, longitude, latitudeDelta, longitudeDelta},
    tileSize,
  ) {
    const refresh = getGrids(
      [latitude - latitudeDelta / 2, longitude - longitudeDelta / 2],
      [latitude + latitudeDelta / 2, longitude + longitudeDelta / 2],
      tileSize,
      {isPost: true},
    );

    // refresh().then(res => console.log('res', res));
    // console.log('r', refresh, refresh(), userLocation.current);

    return [tileSize, refresh(), refresh];
  }

  useEffect(() => {
    reScaleGrids(); // front end grid draw scaling - tiles draw style
    reSampleGrids(useCache); // cached vs live updates - tiles objects fetch
  }, [zoomLayer, bufferedRegion]);

  const reScaleGrids = () => {
    // subsamples grid based on zoom level
  };

  // Refreshes the local grids state, from server or cached
  const reSampleGrids = async useCache => {
    let grids;

    if (!useCache) {
      // Use live data
      const {latitude, longitude} = userLocation.current;
      const {longitudeDelta, latitudeDelta} = zoomLevel.current;

      // Need to "convert" from longLatDeltas to tile size
      // By experimentation

      const tileSize = 10 || getTileSize(zoomLevel.current) || 10;
      console.log('lat', latitude, 'delta', latitudeDelta);
      grids = getGrids(
        [latitude - latitudeDelta / 2, longitude - longitudeDelta / 2],
        [latitude + latitudeDelta / 2, longitude + longitudeDelta / 2],
        tileSize,
      );
    } else {
      // use cached data
      console.log('getting from cache', tileSize);
      // if deviated too far
      // set entry
      // also for loading initial cache entry - cant be static forever

      /////key = tileSize;
      tileSize = zoomLayer * 5;
      key = {
        tileSize,
        latititude: bufferedRegion.latitude,
        longitude: bufferedRegion.longitude,
      };
      // if entry doesnt exist, generate it
      // curently just generate a new bounded area of events
      // should ideally use existing ones if user enters back into already cahced bound area
      //  or just clear cache every time bound changes

      // get grids or set it in cache
      grids = gridZoomCache.getEntryContent(key); // flag overrides expiry_date to now

      // if no cache entry for latlng + zoom
      // make it and save it to cache
      if (!grids) {
        entry = buildCacheEntry(bufferedRegion, tileSize);
        entry[0] = key; // to string maybe for comparison
        gridZoomCache.addEntry(entry);
        grids = entry.refresh();
      }
    }

    grids = (await grids) || [];

    setLocalGrids(grids);
  };

  const getTileSize = ({longitudeDelta, latitudeDelta}) => {};

  // adds a client side grid,
  // informs backend
  const addGrid = () => {};

  const removeGrid = () => {};

  // const setZoomLevel = zl => {
  //   zoomLevel.current = zl;
  // };

  const loadCacheTestData = testGrid => {
    testGrid.forEach((e, i) => {
      const [key, content, refreshContent] = e;
      const entry = {
        key,
        content, // list of grid tiles (bounds), for a specific zoom level
        refreshContent,
      };
      // console.log('entry', entry);
      //gridZoomCache.addEntry(entry);
      gridZoomCache.addEntry(entry);
    });
  };

  const DrawGrids = () => {
    return localGrids.map((grid, i) => {
      if (grid.bounds.length > 0) {
        return (
          <Polygon
            coordinates={grid.bounds}
            strokeColor={'#000000'}
            fillColor={'#' + grid.colour}
            strokeWidth={1}
            key={i}></Polygon>
        );
      }
    });
  };

  return [DrawGrids, localGrids];
}

// const loadLoDs = () => {
//   Object.values(staticLoDs).forEach(LoD => {
//     LoD = {key, content, requestObject, requesterObject};

//     gridCache.addElement(LoD);
//   });
// };

// useEffect(() => {
//   loadLoDs();
// }, []);
