import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {getGrids} from '../../api/api_grids';
import useGeoLocation from './useGeoLocation';
import Cache from './SimpleCache';

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
  const requestsInFlight = useRef(0);

  useEffect(() => {
    // clear cache
    //  if only want to cache for zoom level
    gridZoomCache.clear();
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
    return [tileSize, refresh(), refresh];
  }

  useEffect(() => {
    console.log('updating local gridss');
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

      const tileSize = 5;
      //console.log('lat', latitude, 'delta', latitudeDelta);
      grids = getGrids(
        [latitude - latitudeDelta / 2, longitude - longitudeDelta / 2],
        [latitude + latitudeDelta / 2, longitude + longitudeDelta / 2],
        tileSize,
      );
    } else {
      // Use cached data if availible, else use live data

      // if entry doesnt exist, generate it
      // curently just generate a new bounded area of events
      // should ideally use existing ones if user enters back into already cahced bound area

      const key = zoomLayer;
      const tileSize = zoomLayer;
      console.log('getting grids with tilesize from cache', tileSize);
      grids = await gridZoomCache.getEntryContent(key, 0, (key, entry) => {
        const renderRegionCentre = {
          latitude: renderRegion[latitude],
          longitude: renderRegion[latitude],
        };
        if (pointInBounds(renderRegionCentre, key)) {
          return true;
        } else {
          return false;
        }

        // key is centre point of a region
      }); // flag overrides expiry_date to now
      //console.log('Retrieved possible grids:', grids[0]);
      // if no cache entry for latlng + zoom
      // make it and save it to cache
      if (!grids) {
        //console.log('No Cache Entry: Fetching Grids (tilsesize:)', tileSize);
        entry = buildCacheEntry(renderRegion, tileSize);
        //console.log('Entry Built, adding to cache');
        entry[0] = key;
        //console.log('entry', entry);

        //
        gridZoomCache.addEntry(entry);
        //console.log('Successfully added to cache');
        grids = entry[1];
      }
    }

    // console.log('grids', grids);
    requestsInFlight.current += 1;
    grids = (await grids) || [];
    // could setRegion here to futher prevent snapping (when async loads in)
    // better do loading icon...

    // or skip if map region is no longer here

    // if view region is now outside the buffer region
    //skip

    requestsInFlight.current -= 1;
    //console.log('rif', requestsInFlight.current);
    //if (requestsInFlight.current > 0) return; // dont update if there is a future update expected
    //console.log('setting grids', grids);
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

  //Code taken from: https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
  const hexToRGB = hex => {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return (
        'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.7)'
      );
    }
    throw new Error('Bad Hex');
  };

  const DrawGrids = () => {
    return localGrids.map((grid, i) => {
      if (grid.bounds.length > 0) {
        return (
          <Polygon
            coordinates={grid.bounds}
            strokeColor={'#000000'}
            fillColor={hexToRGB('#' + grid.colour)}
            fillOpacity={0.7}
            strokeWidth={1}
            key={i}></Polygon>
        );
      }
    });
  };
  return [useMemo(() => DrawGrids, [renderRegion, zoomLayer]), localGrids];
  // return [useCallback(DrawGrids, [localGrids]), localGrids];
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
