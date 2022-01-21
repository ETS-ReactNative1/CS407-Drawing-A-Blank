import React, {useState, useEffect, useRef, useCallback} from 'react';
import {getGrids} from '../../api/api_grids';
import useGeoLocation from './useGeoLocation';
import Cache from './SimpleCache';
//import staticLoDs from './LoDs';

// similar hooks can be build for each large state e.g. markers/events
// giving each access to zoomlevel and user location if they need it

// option to use cache - prevents backend multiple spammed requests e.g. by rapid zooming in and out
// Has to be applied in buckets - will result in "popping in" of grids effect whilst panning across a bucket boundary

export default function useLocalGrids(initZoom, {useCache = 0} = {}) {
  const userLocation = useGeoLocation();
  const zoomLevel = useRef(initZoom); // type RNM

  const [localGrids, setLocalGrids] = useState([]);
  const gridCache = useRef(new Cache({}));

  useEffect(() => {
    reSampleGrids(useCache);
  }, [zoomLevel.current, userLocation]);

  // Refreshes the local grids state, from cache
  const reSampleGrids = async useCache => {
    let grids;

    if (!useCache) {
      const {latitude, longitude} = userLocation;
      const {longitudeDelta, latitudeDelta} = zoomLevel.current;

      // Need to "convert" from longLatDeltas to tile size
      // By experimentation

      const tileSize = getTileSize(zoomLevel.current) || 10;

      grids = getGrids(
        [latitude - latitudeDelta / 2, longitude - longitudeDelta / 2],
        [latitude + latitudeDelta / 2, longitude + longitudeDelta / 2],
        tileSize,
      );
    } else {
      grids = gridCache.getElementContent({key: zoomLevel}, 1);
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
