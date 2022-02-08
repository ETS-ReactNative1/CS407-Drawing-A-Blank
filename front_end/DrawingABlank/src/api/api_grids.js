import {request, getToken} from './api_networking.js';
import {getCorners} from '../components/mapView/utils';

export const getGrids = (region, zoom = 10, {isPost = 0} = {}) => {
  const corners = getCorners(region);
  console.log('buf region for girds', region);
  const body = {
    bottom_left: corners[0],
    top_right: corners[1],
    zoom,
  };

  console.log(
    'Sending grid window request with:' + JSON.stringify(body),
    'is postponed ',
    isPost,
  );

  function generateRequest() {
    return getToken()
      .then(token =>
        request('POST', 'map/collect/', '', JSON.stringify(body), token),
      )
      .then(response => {
        if (response.status != 200) {
          throw new Error('Could not retrieve grids.');
        }
        return response.json();
      });
  }

  if (isPost) {
    return (lat, long) => generateRequest();
  } else {
    return generateRequest();
  }
};
