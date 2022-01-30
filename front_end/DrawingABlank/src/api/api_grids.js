import {request} from './api_networking.js';

export const getGrids = (bottom_left, top_right, zoom = 10, {isPost} = {}) => {
  body = {
    bottom_left: bottom_left,
    top_right: top_right,
    bottom_right: 0,
    top_left: 0,
    zoom,
  };

  if (isPost)
    return () => request('POST', 'grid-window/', '', JSON.stringify(body));

  console.log('Sending grid window request with:' + JSON.stringify(body));
  return request('POST', 'grid-window/', '', JSON.stringify(body))
    .then(response => {
      if (!response.ok) {
        throw Error('Bad Request, Cannot Parse');
      }

      return response;
    })
    .then(response => response.json())
    .catch(err => console.log('ERROR: ' + err));
};
