import * as constants from "./constants"

class regionUtils {
  constructor() {
    // console.log('r look', r);
    // this.bounds = this.buildRegionBounds(...r); //spread operator
  }

  buildRegion = (r, scale = 1) => {
    return {
      ...r,
      latitudeDelta: r.latitudeDelta * scale || constants.INIT_ZOOM.latitudeDelta,
      longitudeDelta: r.longitudeDelta * scale || constants.INIT_ZOOM.longitudeDelta,
    };
  };

  // setRegion = r => {
  //   this.bounds = r;
  // };

  checkRegionCoverage(region, compareToRegion) {
    const regionBounds = this.getRegionCorners(region);
    const compareCorners = this.getRegionCorners(compareToRegion);

    const compareRegionCentre = {
      latitude: compareToRegion.latitude,
      longitude: compareToRegion.longitude,
    };

    // if nay of the corners of the current region are outside the render region, re render

    // check if centre of compareregion is outside the region
    // for early exit before loop
    if (!this.checkPointInRegion(region, compareRegionCentre)) return false;

    // checks if any of the corners are oustside the region
    // if they are, return false - no full coverage
    for (let i = 0; i < compareCorners.length; i++) {
      if (!this.checkPointInRegion(region, compareCorners[i])) return false;
    }

    return true;

    //when finingd correct region from cache, need to find which regions
    // have all corners of current view region inside

    // if nay 4 points lay outside the render reigon, need new render region

    return false;
    // if one of the display 4 corners are outside the
    // 4 corners of the render render region corners
    // then need new render region
  }

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

  getRegionCentre = region => {
    let {
      latitude: lat,
      longitude: long,
      latitudeDelta: dLat,
      longitudeDelta: dLong,
    } = region;

    return {
      latitude: lat + dLat / 2,
    };
  };

  getRegionCorners = region => {
    let {
      latitude: lat,
      longitude: long,
      latitudeDelta: dLat,
      longitudeDelta: dLong,
    } = region;

    dLat = dLat / 2 || 0;
    dLong = dLong / 2 || 0;

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
