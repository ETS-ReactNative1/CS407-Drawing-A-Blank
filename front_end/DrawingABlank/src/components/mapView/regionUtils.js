class regionUtils {
  constructor() {
    // console.log('r look', r);
    // this.bounds = this.buildRegionBounds(...r); //spread operator
  }

  buildRegion = (r, scale = 1) => {
    return {
      ...r,
      latitudeDelta: r.latitudeDelta * scale,
      longitudeDelta: r.longitudeDelta * scale,
    };
  };

  // setRegion = r => {
  //   this.bounds = r;
  // };

  checkPointInRegion(region, point) {
    const [bottomLeft, topRight] = this.getRegionCorners(region);

    if (
      point.latitude > topRight.latitude ||
      point.latitude < bottomLeft.latitude ||
      point.longitude > topRight.longitude ||
      point.longitude < bottomLeft.longitude
    ) {
      return false;
    }
    return true;
  }

  getRegionCorners = region => {
    console.log('112233', region);
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
}
export default new regionUtils();
// export default (...r) => new Region(r);

// might be possible for this to = this.bounds
// if we use a prototype for the function definitions
// then prototype may be hidden in this
//          wrong
