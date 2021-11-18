/**
 * Example dummy events data
 *
 * @format
 * @flow strict-local
 */

const ExampleMarkers = () => {
  return {
    markers: [
      {
        id: 1,
        title: 'Example Event2',
        description: 'Example clickable event werweR',
        //geo fix -120.4324 38.78825
        latlng: {latitude: 38.78825, longitude: -120.4324},
        image_uri: 'http://clipart-library.com/data_images/165937.png',
        draggable: false,
      },
    ],
  };
};

export default ExampleMarkers;
