import React, {useState, useEffect, useRef, useCallback} from 'react';
import {getGrids} from '../../api/api_grids';
import useGeoLocation from './useGeoLocation';
import Cache from './SimpleCache';
import {Polygon} from 'react-native-maps';
//import staticLoDs from './LoDs';

// similar hooks can be build for each large state e.g. markers/events
// giving each access to zoomlevel and user location if they need it

// option to use cache - prevents backend multiple spammed requests e.g. by rapid zooming in and out
// Has to be applied in buckets - will result in "popping in" of grids effect whilst panning across a bucket boundary

// use test data: make a random polygon, get it to change with zoom distance
// loadinto cache, to test cache
// fetch and display a range of cache entries based on zoom level
// at least log the trigger

const testGrid = [
  {
    bounds: [
      {latitude: 10, longitude: 10},
      {latitude: 15, longitude: 15},
    ],
  },
];

export default function useLocalGrids(
  initZoom,
  initGrids = [],
  {useCache = 0} = {},
) {
  const userLocation = useGeoLocation();
  const zoomLevel = useRef(initZoom); // type RNM

  const [localGrids, setLocalGrids] = useState(initGrids);
  const gridZoomCache = useRef(new Cache({}));

  useEffect(() => {
    loadCacheTestData();
  }, []);

  useEffect(() => {
    reScaleGrids(); // front end grid draw scaling - tiles draw style
    reSampleGrids(useCache); // cached vs live updates - tiles objects fetch
  }, [zoomLevel.current, userLocation.current]);

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

      grids = getGrids(
        [latitude - latitudeDelta / 2, longitude - longitudeDelta / 2],
        [latitude + latitudeDelta / 2, longitude + longitudeDelta / 2],
        tileSize,
      );
    } else {
      // use cached data
      grids = gridZoomCache.current.getElementContent({key: zoomLevel}, 1);
    }
    grids = (await grids) || [];

    setLocalGrids(grids);
  };

  const getTileSize = ({longitudeDelta, latitudeDelta}) => {};

  // adds a client side grid,
  // informs backend
  const addGrid = () => {};

  const removeGrid = () => {};

  const setZoomLevel = zl => {
    zoomLevel.current = zl;
  };

  const loadCacheTestData = () => {
    testGrid.forEach(grid => {
      entry = {
        key: zoomLevel.current,
        content: grid, // list of grid tiles (bounds), for a specific zoom level
        refreshContent: () => {},
      };
    });

    gridZoomCache.current.addEntry(entry);

    // For actual usage (with server connected refresh):
    // entry = {
    //   key = zoomLevel.current,
    //   content: "",
    //   refresh = () => getGrids("", "", "", "", {isPost:true})
    // }
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
