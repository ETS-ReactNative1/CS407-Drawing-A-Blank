import {request, getToken} from './api_networking.js';

export const getGrids = (bottom_left, top_right, zoom = 10, {isPost} = {}) => {
  body = {
    bottom_left: bottom_left,
    top_right: top_right,
    bottom_right: 0,
    top_left: 0,
    zoom,
  };

  if (isPost)
    return () =>
      request('POST', 'grid-window/', '', JSON.stringify(body), token);

  console.log('Sending grid window request with:' + JSON.stringify(body));
  return getToken()
    .then(token =>
      request('POST', 'map/collect/', '', JSON.stringify(body), token),
    )
    .then(response => {
      if (response.status != 200) {
        throw new Error('Could not retrieve grids.');
      }
      response.json();
    });
};
