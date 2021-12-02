//IMPORTANT: YOU NEED TO CHANGE THIS TO YOUR LOCAL IP ADDRESS WHEN RUNNING THE BACKEND LOCALLY.
//TEMPORARY WORKAROUND UNTIL WE CAN GET CONTINUOUS DEPLOYMENT ON A SERVER (pls dcs gib server)
const API_HOSTNAME = '172.25.13.134';
const API_PORT_NUMBER = '8000';
const API_SUFFIX = '/'; //Example only
const API_URL = 'http://' + API_HOSTNAME + ':' + API_PORT_NUMBER + API_SUFFIX;

/**
 * Sends a request to the API at a specified endpoint and returns an async handler. This has not been tested yet, just writing this so that it is here.
 * @param {String} req_method The HTTP method you want to use.
 * @param {String} req_endpoint The endpoint you wish to contact.
 * @param {String} req_queries Any URL parameters go here
 * @param {String} req_body JSON body if applicable
 * @returns {Promise} Response Promise (I think this is a promise?)
 */
export const request = (req_method, req_endpoint, req_queries, req_body) => {
  var full_URL = API_URL + req_endpoint;
  if (req_queries != '') {
    //For now let us just treat req_queries as a string, but later on we may want to use a more appropriate structure.
    full_URL += req_queries;
  }
  return fetch(full_URL, {
    method: req_method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: req_body,
  });
};
