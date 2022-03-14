import Geolocation from 'react-native-geolocation-service';
import {requestLocationPermission} from './permissions';
// geolocation should be state, but too expensive until map component memoization
const setupGeolocation = async (callback, options) => {
  if ((await requestLocationPermission()).granted) {
    // Use Current Location immediatly
    Geolocation.getCurrentPosition(({coords}) => callback(coords));

    // Listen for future user movement
    const watchId = Geolocation.watchPosition(
      ({coords}) => {
        console.log('first');
        callback(coords);
      },
      e => {
        console.log(e);
      },
      options,
    );

    return {
      watchId,
      setNow: Geolocation.getCurrentPosition(({coords}) => callback(coords)),
    };
  } else {
    console.log('User Permission for Location DENIED');
  }
};

const getCurrentPosition = callback => {
  return Geolocation.getCurrentPosition(({coords}) => callback(coords));
};

const clearWatch = ID => Geolocation.clearWatch(ID);

export default setupGeolocation;
export {getCurrentPosition, clearWatch};
