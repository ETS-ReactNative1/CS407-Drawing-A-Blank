import {request, getToken} from './api_networking.js';

export const getGrids = (
  bottom_left,
  top_right,
  zoom = 10,
  {isPost = 0} = {},
) => {
  const body = {
    bottom_left: bottom_left,
    top_right: top_right,
    bottom_right: 0,
    top_left: 0,
    zoom,
  };

  // console.log(
  //   'Sending grid window request with:' + JSON.stringify(body),
  //   'is postponed ',
  //   isPost,
  // );

  if (isPost) {
    return () =>
      getToken()
        .then(t => request('POST', 'map/collect/', '', JSON.stringify(body), t))
        .then(res => res.json());
  }

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
};
