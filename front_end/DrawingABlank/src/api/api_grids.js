import {request, getToken} from './api_networking.js';
import {getCorners} from '../components/mapView/utils';

export const getGrids = (region, zoom = 10, {isPost = 0} = {}) => {
  const corners = getCorners(region);
  console.log('buf region for girds', region);
  const body = {
    bottom_left: Object.values(corners[0]),
    top_right: Object.values(corners[1]),
    zoom,
  };

  console.log(
    'Sending grid window request with:' + JSON.stringify(body),
    'is postponed ',
    isPost,
  );

  function generateRequest() {
    console.log(
      'Requesting Grids',
      '?bottom_left=' +
        JSON.stringify(Object.values(corners[0])) +
        '&top_right=' +
        JSON.stringify(Object.values(corners[1])) +
        '&zoom=' +
        zoom +
        '/',
    );
    return getToken()
      .then(token =>
        request(
          'GET',
          'map/',
          '?bottom_left=' +
            JSON.stringify(Object.values(corners[0])) +
            '&top_right=' +
            JSON.stringify(Object.values(corners[1])) +
            '&zoom=' +
            zoom +
            '',
          '',
          //JSON.stringify(body),
          token,
        ),
      )
      .then(response => {
        if (response.status != 200) {
          console.log(response);
          throw new Error('Could not retrieve grids.');
        }
        console.log('RESP', response);
        // console.log('JSON', response.json());
        return response.json();
      });
  }

  if (isPost) {
    console.log('here1');
    return (lat, long) => generateRequest();
  } else {
    console.log('here2');
    return generateRequest();
  }
};
