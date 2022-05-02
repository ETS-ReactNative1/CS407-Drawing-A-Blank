import {useRef, useState} from 'react';

const MAP_ZOOMLEVEL_CLOSEST = {latitudeDelta: 0.0005, longitudeDelta: 0.0005};

const convertZoomType = z => {
  z = z['latitudeDelta'];
  //console.log('z', z);
  if (z < 0.00029) {
    return 1;
  } else if (z < 0.0024) {
    return 2;
  } else if (z < 0.0089) {
    return 3;
  } else if (z < 0.4) {
    return 4;
  } else if (z < 0.3) {
    return 5;
  }
  return 6;
};

export default function useZoomLevel() {
  const zoomLevel = useRef(MAP_ZOOMLEVEL_CLOSEST);
  const [tileSize, setTileSize] = useState(5);

  const setZoomLevel = zl => {
    zoomLevel.current = zl;
    setTileSize(convertZoomType(zl));
  };

  return [zoomLevel, tileSize, setZoomLevel];
}
