import {useRef, useState} from 'react';

const MAP_ZOOMLEVEL_CLOSEST = {latitudeDelta: 0.0005, longitudeDelta: 0.0005};

const convertZoomType = z => {
  z = z['latitudeDelta'];
  //console.log('z', z);
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

export default function useZoomLevel() {
  const zoomLevel = useRef(MAP_ZOOMLEVEL_CLOSEST);
  const [tileSize, setTileSize] = useState(5);

  const setZoomLevel = zl => {
    zoomLevel.current = zl;
    setTileSize(convertZoomType(zl));
  };

  return [zoomLevel, tileSize, setZoomLevel];
}
