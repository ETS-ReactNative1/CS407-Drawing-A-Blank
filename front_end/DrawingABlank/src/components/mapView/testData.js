import {AnimatedRegion} from 'react-native-maps';

// testData.js: Holds some dummy data for map simulation
// will eventually be replaced by api interaction

// Initial state can be animated for nice map transitions when moving between markers
// currently WIP
export function getInitialStateAnimated() {
  return {
    region: new AnimatedRegion({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }),
    markers: [
      {
        id: 0,
        title: 'firstEvent',
        description: 'checking this works',
        latlng: {latitude: 37.78825, longitude: -122.4324},
        //draggable: true,
      },
      {
        id: 1,
        title: 'My first Event',
        description: 'Come to my event',
        latlng: {latitude: 37.786, longitude: -122.4324},
        //draggable: true,
      },
      {
        id: 2,
        title: 'My Second Event',
        description:
          'Really long description of an event which says a lot of things. In particular things about the event',
        latlng: {latitude: 37.78, longitude: -122.4324},
        //draggable: true,
      },
      {
        id: 3,
        title: 'My third Event',
        description: 'short desc',
        latlng: {latitude: 37.78, longitude: -122.433},
        //draggable: true,
      },
    ],
    tiles: [],
  };
}

// Non animated version of state
export function getInitialState() {
  return {
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    markers: [
      {
        id: 0,
        title: 'firstEvent',
        description: 'checking this works',
        latlng: {latitude: 37.78825, longitude: -122.4324},
        //draggable: true,
      },
      {
        id: 1,
        title: 'My first Event',
        description: 'Come to my event',
        latlng: {latitude: 37.786, longitude: -122.4324},
        //draggable: true,
      },
      {
        id: 2,
        title: 'My Second Event',
        description:
          'Really long description of an event which says a lot of things. In particular things about the event',
        latlng: {latitude: 37.78, longitude: -122.4324},
        //draggable: true,
      },
      {
        id: 3,
        title: 'My third Event',
        description: 'short desc',
        latlng: {latitude: 37.78, longitude: -122.433},
        //draggable: true,
      },
    ],
    tiles: [],
  };
}
