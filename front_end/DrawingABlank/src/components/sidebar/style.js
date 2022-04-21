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
  },
  entry: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 3,
    marginLeft: 5,
    marginRight: 5,
    flexWrap: 'nowrap',
    backgroundColor: '#f8f8ff',
    borderRadius: 5,
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },

  iconContainer: {},
  icon: {marginLeft: 'auto', marginBottom: 10},
  label: {
    paddingLeft: 10,
    fontSize: 20,
  },
  menuButton: {
    backgroundColor: 'red',
    // margin: 100,
    // padding: 100,
    // position: 'absolute',

    flexShrink: 0,
    flexBasis: 1,
    flexGrow: 1,
    flexDirection: 'row',
  },
  menu_container: {
    //flexShrink: 1,
    //alignSelf: 'flex-start',
    // position: 'absolute',
    //elevation: 10,
    backgroundColor: 'rgba(250,250,250,0.8)',
    //left: 100,
    //marginRight: 60,
    marginLeft: 180,
    borderBottomRightRadius: 4,
  },
  menu: {
    //alignSelf: 'flex-start',
    // position: 'absolute',
    //left: 0,
  },
  sidebarContainer: {
    flexGrow: 1,
    //backgroundColor: 'rgba(250,250,250,0.8)',
    backgroundColor: 'rgba(250,250,250)',
  },
  sidebarContainer_footer: {
    flexGrow: 1,
    justifyContent: 'flex-end',

    marginBottom: 20,
  },
  sidebarContainer_toggleButton: {
    backgroundColor: 'black',
    elevation: 10,
    left: 0,
  },
});
