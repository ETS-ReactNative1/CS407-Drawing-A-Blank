import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {Polygon} from 'react-native-maps';
import {useDidUpdateEffect} from '../hooks/useDidUpdateEffect';
import useGeoLocation from './useGeoLocation';
import {debounce, getCorners} from './utils';
import useLocalGrids from './useLocalGrids';
import useLocalEvents from './useLocalEvents';
import regionTools from './regionUtils';
import { getCurrentPosition } from './geoLocation';
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

const initRegion = {
  latitude: 0,
  longitude: 0,
  ...INIT_ZOOM,
};

// "What is the user looking at"
export default function useRegion(setOverlayVisible, setOverlayContent) {
  // pass view region
  console.log("Init UseRegion Hook")

  const [zoomLayer, setZoomLayer] = useState(6);
  const [viewRegion, setViewRegion] = useState(initRegion); // want view region to be more passive(state->ref) to stop snaps from setting stete too often
  //const viewRegion = useRef()
  const [renderRegion, setRenderRegion] = useState(
    regionTools.buildRegion(initRegion, RENDER_REGION_SCALING_FACTOR),
  ); 
  
  // region features (hooks)
  const [DrawGrids, localGrids] = useLocalGrids(
    [],
    {renderRegion, zoomLayer},
    {useCache: 1, setOverlayVisible, setOverlayContent},
  );
  const [DrawEvents, events] = useLocalEvents(
    [],
    {renderRegion, zoomLayer},
    {useCache: 1, setOverlayVisible, setOverlayContent},
  );  
  
  const regionFeatures = {localGrids, events};

  // Set !inital! map location to user device location  
  useEffect(() => {
    getCurrentPosition(position => {
      setViewRegion(regionTools.buildRegion(position)) // focus job equivalent
      setRenderRegion(regionTools.buildRegion(position, RENDER_REGION_SCALING_FACTOR))
    })
  }, [])

  /**
   * Converts from longlat delta zoom to layer based zoom
   * @param {Object} zoom {latitdudeDelta, longitudeDelta}
   * @returns {int} zoom layer
   */
  const getZoomLayer = zoom => {
    dLat = zoom['latitudeDelta'];

    layer = 1;

    if (dLat < 0.0005) {
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
   * @returns {Array} Draw object - Contains all drawable features for the map as JSX array
   */
  const DrawRenderRegionFeatures = ({showRegionOutline}) => {
    // key property neccessary for react to indetify each as unique
    const Draw = [DrawEvents({key: 1}), DrawGrids({key: 2})];
    if (showRegionOutline) Draw.push(DrawRenderRegionOutline({key: 3}));
    return Draw;
  };

  /**
   * Updates the region ref to backup current map location in case of re renders
   * If focusJob flag set, immediatly sets map to the new location.
   * Otherwise just store the region to be shown next re render (i.e. in the future)
   * @param {Object} displayRegion Current region the user can see on their display - the field of view (region) of the map
   * @param {Boolean} isFocusJob Flag to demand immediate refocus of map,
   *
   */
  const updateRegion = (displayRegion, isFocusJob = false) => {
    // focusRegionRef.current = displayRegion;
    if (isFocusJob) {
      setViewRegion(displayRegion);
      return; // dont need to compute new render region if we are still inside "best" one - must be true if we have focus job trigger (e.g. auto pan to clicked event mrker)
    }
    console.log("zoomlayer", zoomLayer)
    setViewRegion(displayRegion) // "backup" current view region (for anticipated upcoming re render)
    
    const displayLocation = {
      latitude: displayRegion.latitude,
      longitude: displayRegion.longitude,
    };
    const displayZoom = {
      latitudeDelta: displayRegion.latitudeDelta,
      longitudeDelta: displayRegion.longitudeDelta,
    };
    const displayZoomLayer = getZoomLayer(displayZoom);

    // update zoomlayer if changed - for zoom depenednet features e.g. grids
    setZoomLayer((z) => displayZoomLayer);

    // if current user view can see outside their render region, update the render region
    // to cover the wider view
    if (!regionTools.checkRegionCoverage(renderRegion, displayRegion)) {
      const new_renderRegion = regionTools.buildRegion(
        displayRegion,
        RENDER_REGION_SCALING_FACTOR,
      );
      setRenderRegion((r) => new_renderRegion);
    }

      
    
  };

  return [
    viewRegion, // left as ref for now, to be made properly handled state - or maybe not
    updateRegion,
    regionFeatures,
    DrawRenderRegionFeatures,
    // useMemo(DrawRenderRegionFeatures(), [DrawEvents, DrawGrids]),
  ];
}
