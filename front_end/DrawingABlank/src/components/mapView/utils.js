export const getCorners = region => {
  let {
    latitude: lat,
    longitude: long,
    latitudeDelta: dLat,
    longitudeDelta: dLong,
  } = region;

  dLat = dLat / 2 || 0;
  dLong = dLong / 2 || 0;

  console.log('dlatlng', dLat, dLong, lat, long);

  const bottomLeft = {
    latitude: lat - dLat,
    longitude: long - dLong,
  };

  const topRight = {
    latitude: lat + dLat,
    longitude: long + dLong,
  };

  const topLeft = {
    latitude: lat - dLat,
    longitude: long + dLong,
  };

  const bottomRight = {
    latitude: lat + dLat,
    longitude: long - dLong,
  };

  return [bottomLeft, topRight, bottomRight, topLeft];
};
