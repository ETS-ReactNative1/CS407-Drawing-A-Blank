import Geolocation from 'react-native-geolocation-service';
import {requestLocationPermission} from './permissions';

const setupGeolocation = async (callback, options) => {
  if ((await requestLocationPermission()).granted) {
    // Use Current Location immediatly
    Geolocation.getCurrentPosition(({coords}) => callback(coords));

    // Listen for future user movement
    const watchId = Geolocation.watchPosition(
      ({coords}) => {
        callback(coords);
      },
      e => {
        console.log(e);
      },
      options,
    );

    return {
      clear: ID => Geolocation.clearWatch(ID),
      setNow: Geolocation.getCurrentPosition(({coords}) => callback(coords)),
    };
  } else {
    console.log('User Permission for Location DENIED');
  }
};

const getCurrentPosition = callback => {
  return Geolocation.getCurrentPosition(({coords}) => callback(coords));
};

export default setupGeolocation;
export {getCurrentPosition};
