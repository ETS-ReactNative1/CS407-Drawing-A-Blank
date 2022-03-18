import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  settings_button: {
    backgroundColor: 'rgba(250,250,250,0.8)',
    marginLeft: 170,
    marginRight: 180,

    marginTop: 18,
    left: -150,
    borderRadius: 5,
    elevation: 1,
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

  menuIcon: {
    alignSelf: 'flex-start',
  },
});
