import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {Polygon} from 'react-native-maps';
import {useDidUpdateEffect} from '../hooks/useDidUpdateEffect';
import useGeoLocation from './useGeoLocation';
import {debounce, getCorners} from './utils';
import useLocalGrids from './useLocalGrids';
import useLocalEvents from './useLocalEvents';
import regionTools from './regionUtils';
// issue perhaps of region not being set for first load
// due to geolocation async update

// Since region is related only to the map
// should probably use all map state hooks in this file
// export a single "region" for the map
// with all the tiles on it

const RENDER_REGION_SCALING_FACTOR = 1.5;

const INIT_ZOOM = {
  latitudeDelta: 0.6039001489487674,
  longitudeDelta: 0.5393288657069206,
};

// const buildRenderRegion = region => {
//   const r = {
//     ...region,
//     latitudeDelta: region.latitudeDelta * RENDER_REGION_FACTOR,
//     longitudeDelta: region.longitudeDelta * RENDER_REGION_FACTOR,
//   };
//   return r;
// };

// "What is the user looking at"
export default function useRegion() {
  const initRegion = {
    latitude: 0,
    longitude: 0,
    ...INIT_ZOOM,
  };

  const deviceLocation = useGeoLocation();
  const [zoomLayer, setZoomLayer] = useState(1);
  const [renderRegion, setRenderRegion] = useState(
    regionTools.buildRegion(initRegion, RENDER_REGION_SCALING_FACTOR),
  );
  const [focusRegion, _setFocusRegion] = useState(initRegion); // technically jsut a render trigger for below ref
  const focusRegionRef = useRef(focusRegion); // tracks current user view
  const setFocusRegion = region => {
    focusRegionRef.current = region;
    _setFocusRegion(region);
  };
  const [DrawGrids, localGrids] = useLocalGrids(
    [],
    {renderRegion, zoomLayer},
    {useCache: 1},
  );
  const [DrawEvents, events] = useLocalEvents(
    [],
    {renderRegion, zoomLayer},
    {useCache: 1},
  );
  const isUserTrackingEnabled = useRef(false);
  const regionFeatures = {localGrids, events};

  // Set !inital! map location to user device location
  useDidUpdateEffect(() => {
    uLoc = deviceLocation.current;
    r = regionTools.buildRegion({...INIT_ZOOM, ...deviceLocation.current});
    setFocusRegion(r);
  }, [deviceLocation.current]);

  /**
   * Converts from longlat delta zoom to layer based zoom
   * @param {Object} zoom {latitdudeDelta, longitudeDelta}
   * @returns {int} zoom layer
   */
  const getZoomLayer = zoom => {
    dLat = zoom['latitudeDelta'];

    layer = 1;

    if (dLat < 0.00029) {
      layer = 1;
    } else if (dLat < 0.0024) {
      layer = 2;
    } else if (dLat < 0.0089) {
      layer = 3;
    } else if (dLat < 0.04) {
      layer = 4;
    } else if (dLat < 0.3) {
      layer = 5;
    } else {
      layer = 6;
    }

    return layer;
  };

  /**
   * Draws the outline of the current render region
   * @returns {Object} (Rectangular) React Native Maps Polygon representing the region
   */
  const DrawRenderRegionOutline = () => {
    coordinates = regionTools.getRegionCorners(renderRegion);
    return (
      <Polygon
        coordinates={coordinates}
        fillColor={'#000000'}
        key={-1}></Polygon>
    );
  };

  /**
   * Draws the features of the map, e.g. grids, events
   * @param {Object} Options
   * @param {Boolean} Options.showRegionOutline Set flag to show render region outline on map
   * @returns {Array} Draw object
   */
  const DrawRenderRegionFeatures = ({showRegionOutline}) => {
    const Draw = [DrawEvents({key: 1}), DrawGrids({key: 2})];
    if (showRegionOutline) Draw.push(DrawRenderRegionOutline({key: 3}));
    return Draw;
  };

  /**
   * Updates the region ref to backup current map location in case of re renders
   * If focusJob flag set, immediatly sets map to the new location.
   * Otherwise just store the region to be shown next re render (i.e. in the future)
   * @param {Object} displayRegion
   * @param {Boolean} isFocusJob Flag to demand immediate refocus of map,
   *
   */
  const updateRegion = (displayRegion, isFocusJob = false) => {
    focusRegionRef.current = displayRegion;
    if (isFocusJob) {
      setFocusRegion(displayRegion);
      return; // dont need to compute new render region if we are still inside "best" one
    }

    const displayLocation = {
      latitude: displayRegion.latitude,
      longitude: displayRegion.longitude,
    };
    const displayZoom = {
      latitudeDelta: displayRegion.latitudeDelta,
      longitudeDelta: displayRegion.longitudeDelta,
    };
    const displayZoomLayer = getZoomLayer(displayZoom);

    // if current user view can see outside their render region, update the render region
    // to cover the wider view
    if (!regionTools.checkRegionCoverage(renderRegion, displayRegion)) {
      const new_renderRegion = regionTools.buildRegion(
        displayRegion, // have managed to completly disregard zoomlevel when picking render region zoom level
        RENDER_REGION_SCALING_FACTOR,
      );
      setRenderRegion(new_renderRegion);
    }

    // change of zoom layer, so re render zoomlayer dependent components
    if (zoomLayer != displayZoomLayer) {
      // if current user zoom level is outisde current level limits,
      // set new zoom level
      // affects rendering level-of-detail components
      setZoomLayer(displayZoomLayer);
    }
  };

  return [
    focusRegionRef.current, // left as ref for now, to be made properly handled state - or maybe not
    updateRegion,
    regionFeatures,
    DrawRenderRegionFeatures,
    // useMemo(DrawRenderRegionFeatures(), [DrawEvents, DrawGrids]),
  ];
}
