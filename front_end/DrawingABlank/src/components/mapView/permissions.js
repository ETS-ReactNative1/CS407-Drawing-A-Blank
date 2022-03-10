import {PermissionsAndroid} from 'react-native';

export async function requestLocationPermission() {
  try {
    const granted = PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
    ]);

    return {
      granted:
        Object.values(await granted).filter(
          permission => permission !== PermissionsAndroid.RESULTS.GRANTED,
        ).length === 0,
    };
  } catch (err) {
    console.log(err);
  }
}
