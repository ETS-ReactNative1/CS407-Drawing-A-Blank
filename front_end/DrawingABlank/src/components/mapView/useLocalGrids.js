import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {getGrids} from '../../api/api_grids';
import useGeoLocation from './useGeoLocation';
import Cache from './SimpleCache';
import useRegion from './useRegion';
import {Polygon} from 'react-native-maps';
import {getCorners} from './utils';
import {createEmptyStatement} from 'typescript';
import {useDidUpdateEffect} from '../hooks/useDidUpdateEffect';
import useZoomLevel from './useZoomLevel';
//import staticLoDs from './LoDs';

// similar hooks can be build for each large state e.g. markers/events
// giving each access to zoomlevel and user location if they need it

// option to use cache - prevents backend multiple spammed requests e.g. by rapid zooming in and out
// Has to be applied in buckets - will result in "popping in" of grids effect whilst panning across a bucket boundary

// use test data: make a random polygon, get it to change with zoom distance
// loadinto cache, t test cache
// fetch and display a range of cache entries based on zoom level
// at least log the trigger

const gridZoomCache = new Cache({});

export default function useLocalGrids(
  initGrids = [],
  {renderRegion, zoomLayer},
  {useCache = 0} = {},
) {
  const userLocation = useGeoLocation();
  const [localGrids, setLocalGrids] = useState(initGrids);

  useEffect(() => {
    // clear cache
    //  if only want to cache for zoom level
  }, [renderRegion]);

  useEffect(() => {
    //clear caache
    //  if only want to cache for region
  }, [zoomLayer]);

  function buildCacheEntry(
    {latitude, longitude, latitudeDelta, longitudeDelta},
    tileSize,
  ) {
    const refresh = getGrids(renderRegion, tileSize, {isPost: true});

    // refresh().then(res => console.log('res', res));
    // console.log('r', refresh, refresh(), userLocation.current);

    return [tileSize, refresh(), refresh];
  }

  useEffect(() => {
    reScaleGrids(); // front end grid draw scaling - tiles draw style
    reSampleGrids(useCache); // cached vs live updates - tiles objects fetch
  }, [zoomLayer, renderRegion]);

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

      const tileSize = 5;
      console.log('lat', latitude, 'delta', latitudeDelta);
      grids = getGrids(
        [latitude - latitudeDelta / 2, longitude - longitudeDelta / 2],
        [latitude + latitudeDelta / 2, longitude + longitudeDelta / 2],
        tileSize,
      );
    } else {
      // use cached data

      // if deviated too far
      // set entry
      // also for loading initial cache entry - cant be static forever

      /////key = tileSize;
      const tileSize = zoomLayer * 5;
      key = {
        tileSize,
        latititude: renderRegion.latitude,
        longitude: renderRegion.longitude,
      };

      // if entry doesnt exist, generate it
      // curently just generate a new bounded area of events
      // should ideally use existing ones if user enters back into already cahced bound area
      //  or just clear cache every time bound changes

      // get grids or set it in cache
      console.log('Getting from cache, key:', key);
      grids = await gridZoomCache.getEntryContent(key); // flag overrides expiry_date to now
      console.log('Retrieved possible grids:', grids);
      // if no cache entry for latlng + zoom
      // make it and save it to cache
      if (!grids) {
        console.log('No Cache Entry: Fetching Grids');
        entry = buildCacheEntry(renderRegion, tileSize);
        console.log('Entry Built, adding to cache');
        entry[0] = key; // to string maybe for comparison
        console.log('entry', entry);
        gridZoomCache.addEntry(entry);
        console.log('Successfully added to cache');
        grids = entry[1];
      }
    }

    //console.log('grids', grids);

    grids = (await grids) || [];
    //console.log('Displaying Grids: ', grids);
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

  const DrawRenderRegion = () => {
    coordinates = getCorners(renderRegion);
    return <Polygon coordinates={coordinates} fillColor={'#000000'}></Polygon>;
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

  return [DrawGrids, localGrids, DrawRenderRegion];
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
