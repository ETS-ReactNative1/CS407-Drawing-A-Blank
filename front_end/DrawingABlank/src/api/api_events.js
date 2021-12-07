import {request} from './api_networking.js';

/**
 * 
 * @param {JSON Object} bounds | The bounds of the event which will be used to calculate a centre 
  @returns {Latitude and Longitude} marker | The position of the marker
*/
function getMarkerPosition(bounds){
  //This is assuming for the moment that everything is in the correct ordering, which is a non-self-intersecting polygon of n vertices
  //This code has been adapted from the following Wikipedia formula: https://en.wikipedia.org/wiki/Centroid#Of_a_polygon
  //Also assuming that latitude is "x" and longitude is "y", and the error obtained by doing this is negligible.
  //It is important to note the last part, which states that the last case must loop.
  //First, compute the area
  var area = 0.0;
  for(var i = 0; i < bounds.length; i++){
    area += (bounds[i][0]*bounds[(i+1)%bounds.length][1] - bounds[(i+1)%bounds.length][0]*bounds[i][1])/2;
  }

  //Compute the centre x and centre y
  var centre_x = 0.0;
  var centre_y = 0.0;
  for(var i = 0; i < bounds.length; i++){
    centre_x += ((bounds[i][0] + bounds[(i+1)%bounds.length][0]) * (bounds[i][0]*bounds[(i+1)%bounds.length][1] - bounds[(i+1)%bounds.length][0]*bounds[i][1]))/(6*area);
    centre_y += ((bounds[i][1] + bounds[(i+1)%bounds.length][1]) * (bounds[i][0]*bounds[(i+1)%bounds.length][1] - bounds[(i+1)%bounds.length][0]*bounds[i][1]))/(6*area);
  }

  return {"latitude":centre_x, "longitude":centre_y};
}

function getBoundsAsJSON(bounds){
  var result = [];
  for(var i = 0; i < bounds.length; i++){
    result.push({"latitude":bounds[i][0], "longitude":bounds[i][1]});
  }
  return result;
}

export const getEvents = () => {
  return request('GET', 'current-events', '', '')
    .then(response => response.json())
    .then(data => {
      console.log("Got:"+JSON.stringify(data));
      var result = [];
      for (var key in data) {
        var curr_object = data[key];

        var new_object = {
          //No title or description has been provided by the endpoint at the moment.
          //Therefore, we are going to use default title names.
          id: key,
          title: 'Title for Event ' + key,
          description: 'Description for Event ' + key,
          bounds: {
            coordinates:getBoundsAsJSON(curr_object.bounds),
            //Change these details if added by back-end
            strokeColor:"#000",
            fillColor:"rgba(43, 145, 222, 0.2)",
            strokeWidth:1,
            name: 'Area for event ' + key,
            id: key,
          },
          marker: getMarkerPosition(curr_object.bounds),
          date_start: curr_object.start,
          date_end: curr_object.end
        };
        result.push(new_object);
      }
      console.log('Returning :' + JSON.stringify(result));
      return result;
    })
    .catch(err => console.log(err));
}
