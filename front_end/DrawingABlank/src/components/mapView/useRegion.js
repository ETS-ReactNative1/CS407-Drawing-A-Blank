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
  // basic region object
  const initRegion = {
    latitude: 0,
    longitude: 0,
    ...INIT_ZOOM,
  };

  const deviceLocation = useGeoLocation();
  const [zoomLayer, setZoomLayer] = useState(1);
  // render region - am just upscaling to expanded region when needed

  // const [region, setRegion] = useState({
  //   latitude: 0,
  //   longitude: 0,
  //   ...INIT_ZOOM,
  // });
  // camera focus region - need to detach from renderRegion
  //    prevents map feature loading whilst panning within a renderRegion
  // state to trigger re render on demand
  // ref to rememeber map location for otherwise triggered re render e.g. looking outside the render region
  const [renderRegion, setRenderRegion] = useState(
    regionTools.buildRegion(initRegion, RENDER_REGION_SCALING_FACTOR),
  );
  const [focusRegion, _setFocusRegion] = useState(initRegion); // technically jsut a render trigger for below ref
  const focusRegionRef = useRef(focusRegion); // tracks current user view

  // revert the above state+ref to just state, then only apply e.g 25% of the re renders
  // i.e. want to ignore 75% of the devive locatino changes
  // WHY? : current rapid device movement causes rapid re render if left as state and applying every render change
  // map is too complex to be rendered that rapidly, so causes slow down
  // to avoid, reduce re renders, e.g. only 25% or only when strictly necceassry (ref solution)

  const setFocusRegion = region => {
    focusRegionRef.current = region;
    _setFocusRegion(region);
    console.log('focus', region);
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

  const regionFeatures = {localGrids, events};
  const isTrackingEnabled = false;

  // const buildRegion = (location, zoomlevel) => {
  //   return {
  //     latitude: location.latitude,
  //     longitude: location.longitude,
  //     ...INIT_ZOOM,
  //   };
  // };

  // compare region to render region i.e. scale up by factor e.g. 1.5

  // renderRegion as state, controls camera position/ what is seen
  // can then derive the actual camera region bounds from that
  //    as will always want to show what is being rendered

  // Set region to device location
  // should be predifined zoom level here
  // "first load zoom level"
  // should now be unneesary - why?

  // tracks device location, sets maps focus region to device location if tracking enabled
  // useEffect(() => {
  //   if (isTrackingEnabled) setFocusRegion(buildRegion(deviceLocation.current));
  // }, [deviceLocation.current]);
  //ref - want to avoid spam re renders, so should one do like 1 per sec if convering to state
  // otherwise location updates only reflected to user when someting else causes state to change e.g. grids update, render region update, userpath update,

  useDidUpdateEffect(() => {
    uLoc = deviceLocation.current;

    r = regionTools.buildRegion({...INIT_ZOOM, ...deviceLocation.current});
    // updateRergion(r);
    console.log('set region', r);

    setFocusRegion(r);
  }, [deviceLocation.current]);

  const DrawRenderRegionOutline = () => {
    coordinates = regionTools.getRegionCorners(renderRegion);
    return (
      <Polygon
        coordinates={coordinates}
        fillColor={'#000000'}
        key={-1}></Polygon>
    );
  };

  const getNewZoomLayer = zoom => {
    dLat = zoom['latitudeDelta'];

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

    if (zoomLayer !== layer) return layer;
  };

  const DrawRenderRegionFeatures = ({showRegionOutline}) => {
    console.log('TESTING PROP TYPE: ', showRegionOutline, ' expected: bool');

    const Draw = []; // [DrawEvents({key: 1}), DrawGrids({key: 2})];
    if (showRegionOutline) Draw.push(DrawRenderRegionOutline({key: 3}));
    console.log(Draw);
    return Draw;
  };

  // want set region
  // set ref

  // if "inside renderRegion"
  //    update viewregion state
  // else
  //    just update ref (state is unnessary)
  //    do update region check

  // const [regionZoom, setRegionZoom] = useState();
  // const [regionLocation, setRegionLocation] = useState();

  // use debounce when being called to reduce spam on big pans
  // updateRegion - accepts a region and checks to see if its out of current cache bounds
  // if it is, need to get new map data, re render .
  const updateRegion = (displayRegion, isFocusJob = 0) => {
    focusRegionRef.current = displayRegion;
    console.log('update', displayRegion);
    if (isFocusJob) {
      setFocusRegion(displayRegion);
      return; // dont need to compute new render region if we are still inside "best" one
    }

    const displayZoom = {
      latitudeDelta: displayRegion.latitudeDelta,
      longitudeDelta: displayRegion.longitudeDelta,
    };
    const displayLocation = {
      latitude: displayRegion.latitude,
      longitude: displayRegion.longitude,
    };

    // async ref
    // update region ref here
    // pass to children which need to confirm action is still required
    // on async action
    // e.g. pan, pause1 => load1, pan, pause2 => load2
    // ==> render1, render2
    //    to
    // pan, pause1 => load1, pan, pause2 => load2
    // ==> ignore render1 (out of date), render2
    console.log('updateing Regin', displayLocation);
    const new_zoomLayer = getNewZoomLayer(displayZoom);
    const new_renderRegion = regionTools.buildRegion(
      displayRegion, // have managed to completly disregard zoomlevel when picking render region zoom level
      RENDER_REGION_SCALING_FACTOR,
    );
    const cur_renderRegion = renderRegion;

    // zooming out wont make render region bigger
    // on zoom level change maybe - but should just be linar with zoom or could have missed bits

    // should do location check earlier for better performance

    // focusregion.setstate  = uloc
    // then dont need ref
    //    still need ref as wont be able to set prvious state
    if (new_zoomLayer) setZoomLayer(new_zoomLayer);
    if (
      !regionTools.checkPointInRegion(cur_renderRegion, displayLocation) ||
      false
      // !regionTools.checkRegionZoomCoverage(cur_renderRegion, displayZoom) // can just use zoom, then point already works
    )
      // check if looking outside current
      setRenderRegion(new_renderRegion);
    console.log('update end');
  };

  return [
    focusRegionRef.current, // left as ref for now, to be made state
    updateRegion,
    regionFeatures,
    DrawRenderRegionFeatures,
    // useMemo(DrawRenderRegionFeatures(), [DrawEvents, DrawGrids]),
  ];
}
