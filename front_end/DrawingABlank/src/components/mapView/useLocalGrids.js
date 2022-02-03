import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {getGrids} from '../../api/api_grids';
import useGeoLocation from './useGeoLocation';
import Cache from './SimpleCache';
import {Polygon} from 'react-native-maps';
import {createEmptyStatement} from 'typescript';
import {useDidUpdateEffect} from '../hooks/useDidUpdateEffect';
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

export default function useLocalGrids(
  initZoom,
  initGrids = [],
  {useCache = 0} = {},
) {
  const convertZoomType = z => {
    z = z['latitudeDelta'];
    console.log('z', z);
    if (z < 0.00029) {
      return 5;
    } else if (z < 0.0024) {
      return 10;
    } else if (z < 0.0089) {
      return 15;
    } else if (z < 0.4) {
      return 20;
    } else if (z < 0.3) {
      return 25;
    }
    return 30;
  };

  const userLocation = useGeoLocation();
  const zoomLevel = useRef(initZoom); // type RNM
  // const [zoomLevel, setZoomLevel] = useState(initZoom);
  // am setting zoom level on each time zoom changes, since deltas are used,
  // will also trigger a render on movement
  const [tileSize, setTileSize] = useState(convertZoomType(zoomLevel.current));

  const [localGrids, setLocalGrids] = useState(initGrids);

  // console.log('grid', testGrid);

  const setZoomLevel = zl => {
    // console.log('zl', zl);
    zoomLevel.current = zl;

    setTileSize(convertZoomType(zl));
  };

  function buildTestEntry({latitudeDelta, longitudeDelta}, tileSize) {
    const {latitude, longitude} = userLocation.current;
    const ts = (tileSize + 1) * 5;
    const refresh = getGrids(
      [latitude - latitudeDelta / 2, longitude - longitudeDelta / 2],
      [latitude + latitudeDelta / 2, longitude + longitudeDelta / 2],
      ts,
      {isPost: true},
    );

    // refresh().then(res => console.log('res', res));
    // console.log('r', refresh, refresh(), userLocation.current);

    return [ts, refresh(), refresh];
  }

  useDidUpdateEffect(() => {
    console.log('Generating Zoomlevel Grid Cache Entries');

    const testGrid = [
      buildTestEntry(
        {
          latitudeDelta: 0.00029472723308288096,
          longitudeDelta: 0.00026319175958633423,
        },
        0,
      ),
      buildTestEntry(
        {
          latitudeDelta: 0.0024015043252560986,
          longitudeDelta: 0.0021447613835332557,
        },
        1,
      ),
      buildTestEntry(
        {
          latitudeDelta: 0.008977814245206162,
          longitudeDelta: 0.008017458021641,
        },
        2,
      ),
      buildTestEntry(
        {
          latitudeDelta: 0.04028943063934065,
          longitudeDelta: 0.03597881644964218,
        },
        3,
      ),
      buildTestEntry(
        {
          latitudeDelta: 0.3070263557894961,
          longitudeDelta: 0.2741556242108345,
        },
        4,
      ),
      ,
    ];

    console.log('Caching Grid Cache Entries');

    loadCacheTestData(testGrid);
  }, [userLocation.current]);

  useEffect(() => {
    reScaleGrids(); // front end grid draw scaling - tiles draw style
    reSampleGrids(useCache); // cached vs live updates - tiles objects fetch
  }, [tileSize]);

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
      console.log('getting from cache');
      key = tileSize;
      grids = gridZoomCache.getEntryContent(key); // flag overrides entry expiry_date to now
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

  return [DrawGrids, setZoomLevel, localGrids];
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
