import {request} from './api_networking.js';

const OSPoint = require('ospoint');

export const getEvents = () => {
  return request('GET', 'current-events', '', '')
    .then(response => {console.log(response);response.json();})
    .then(data => {
      var markers = [];
      for (var key in data) {
        var curr_object = data[key];
        var northings = curr_object.northing;
        var eastings = curr_object.easting;
        var converted_point = new OSPoint(northings, eastings).toWGS84();
        var new_object = {
          //No title or description has been provided by the endpoint at the moment.
          //Therefore, we are going to use default title names.
          id: key,
          title: 'Default Title.',
          description: 'Default Description.',
          latlng: {
            latitude: converted_point.latitude,
            longitude: converted_point.longitude,
          },
        };
        markers.push(new_object);
      }
      console.log('Returning :' + markers);
      return markers;
    })
    .catch(err => console.log(err));
}
