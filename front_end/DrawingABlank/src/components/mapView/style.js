import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  map: {...StyleSheet.absoluteFillObject},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    elevation: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    marginLeft: 40,
    marginRight: 40,
    height: 60,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  button: {},
  paused: {
    backgroundColor: 'red',
    borderRadius: 15,
  },
  menu: {
    //position: 'absolute',
    // backgroundColor: 'black',
    flexDirection: 'row',
    flexGrow: 0,
    flexShrink: 1,
    alignContent: 'flex-start',
  },
  // menu_container: {
  //   flexShrink: 1,
  //   alignSelf: 'flex-start',
  //   // position: 'absolute',
  //   elevation: 10,
  //   // backgroundColor: 'black',
  // },
  menuIcon: {
    alignSelf: 'flex-start',
  },
});
