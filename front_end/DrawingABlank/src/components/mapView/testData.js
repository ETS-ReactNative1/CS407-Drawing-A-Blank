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
    colourSpaces: [
        {
          coordinates: [
            { latitude: 37.8025259, longitude: -122.4351431 },
            { latitude: 37.7896386, longitude: -122.421646 },
            { latitude: 37.7665248, longitude: -122.4161628 },
            { latitude: 37.7734153, longitude: -122.4577787 },
          ],
          strokeColor:"#000",
          fillColor:"rgba(43, 145, 222, 0.54)",
          strokeWidth:1,
          name: 'Example area',
          id: 0,
        },
        {
          coordinates:[
            {latitude:52.2875453592547, longitude:-1.533905726176639}, 
            {latitude:52.28681474277165, longitude:-1.533297664996668}, 
            {latitude:52.28921708138118, longitude:-1.5269975738955839},
            {latitude:52.28998386541584, longitude:-1.5276491631345825}, 
          ],
          strokeColor:"#000",
          fillColor:"rgba(43, 145, 222, 0.54)",
          strokeWidth:1,
          name: 'Example area from API',
          id: 1,
        },
        /* Original data from the API which is broken.
        {
          coordinates:[
            {latitude:52.2875453592547, longitude:-1.533905726176639}, 
            {latitude:52.28998386541584, longitude:-1.5276491631345825}, 
            {latitude:52.28681474277165, longitude:-1.533297664996668},
            {latitude:52.28921708138118, longitude: -1.5269975738955839}, 
          ],
          strokeColor:"#000",
          fillColor:"rgba(43, 145, 222, 0.54)",
          strokeWidth:1,
          name: 'Example area from API',
          id: 1,
        }
        */
    ],
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
