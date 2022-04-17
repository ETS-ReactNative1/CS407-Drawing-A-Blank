import * as constants from "./constants"

/**
 * @typedef {Object} region
 * @property {longlat} latitude latitude coordinate
 * @property {longlatDelta} longitude latitude coordinate
 */

/**
 * @typedef {Object} longlat
 * @property {number} longitude coordinate
 * @property {number} latitude  coordinate
 */

/**
 * @typedef {Object} longlatDelta long lat deltas
 * @property {number} longitudeDelta zoom
 * @property {number} latitudeDelta zoom
 */

class regionUtils {
  constructor() {}

  /**
   * Generates a region object from a  given centre, and optional scaling value
   * @param {region} r region object
   * @param {number=1} scale scaling factor applied to passed region 
   * @returns {region} scale transformed region
   */
  buildRegion = (r, scale = 1) => {
    return {
      ...r,
      latitudeDelta: r.latitudeDelta * scale || constants.INIT_ZOOM.latitudeDelta * scale,
      longitudeDelta: r.longitudeDelta * scale || constants.INIT_ZOOM.longitudeDelta * scale,
    };
  };

  /**
   * Compares two regions, determines if region 2 is inside region 1 by region centre and corners
   * @param {region} region - region 1
   * @param {region} compareToRegion - region 2 
   * @returns {Boolean} true if region 2 is inside, else false
   */
  checkRegionCoverage(region, compareToRegion) {
    const regionBounds = this.getRegionCorners(region);
    const compareCorners = this.getRegionCorners(compareToRegion);

    const compareRegionCentre = {
      latitude: compareToRegion.latitude,
      longitude: compareToRegion.longitude,
    };

    // check if centre of compareregion is outside the region
    // for early exit before loop
    if (!this.checkPointInRegion(region, compareRegionCentre)) return false;

    // checks if any of the corners are oustside the region
    // if they are, return false - no full coverage
    for (let i = 0; i < compareCorners.length; i++) {
      if (!this.checkPointInRegion(region, compareCorners[i])) return false;
    }

    return true;
  }

  /**
   * Determines if a long-lat coordinate is inside of a region
   * @param {region} region 
   * @param {longlat} point 
   * @returns {Boolean} True is longlat is insude region, else false
   */
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


  /**
   * Returns the centre of a provided region
   * @param {region} region 
   * @returns {longlat} Centre of the region
   */
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

  /**
   * Returns all four corners of a region
   * @param {region} region 
   * @returns {[longlat]} Region corners [bottomleft, topright, bottomright, top left]
   */
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
