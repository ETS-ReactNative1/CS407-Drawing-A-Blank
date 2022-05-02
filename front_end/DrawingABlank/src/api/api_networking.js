import * as SecureStorage from 'expo-secure-store';

//These are the constant relating to the server to contact. Update these if you are running your server locally or on another service.
const API_HOSTNAME = 'drawab.dcs.warwick.ac.uk';
const API_PORT_NUMBER = '443';
const API_SUFFIX = '/'; //Example only
const API_URL = 'https://' + API_HOSTNAME + ':' + API_PORT_NUMBER + API_SUFFIX;
const TOKEN_KEY_NAME = 'fresgo_access_token';
const TEAM_KEY_NAME = 'fesgo_team';
const USERNAME_KEY_NAME = 'fresgo_username';
/**
 * Sends a request to the API at a specified endpoint and returns an async handler.
 * @param {String} req_method The HTTP method you want to use.
 * @param {String} req_endpoint The endpoint you wish to contact.
 * @param {String} req_queries Any URL parameters go here
 * @param {String} req_body JSON body if applicable
 * @returns {Promise} Response Promise (I think this is a promise?)
 */
export const request = (
  req_method,
  req_endpoint,
  req_queries,
  req_body,
  req_authentication = '',
) => {
  var full_URL = API_URL + req_endpoint;
  if (req_queries != '') {
    full_URL += req_queries;
  }
  console.log(full_URL);
  return fetch(full_URL, {
    method: req_method,
    headers: {
      Accept: 'application/json',
      Authorization:
        req_authentication != '' ? 'Token ' + req_authentication : '',
      'Content-Type': 'application/json',
    },
    body: req_body,
  });
};
/*
  The following are storage functions for obtaining certain information about a user that is saved on the phone, such as their
  authentication token and information about their profile (username and team), as well as functions for deleting this information,
  which a user may want when logging out.
*/
export const getToken = () => {
  return SecureStorage.getItemAsync(TOKEN_KEY_NAME);
};

export const setToken = token => {
  SecureStorage.setItemAsync(TOKEN_KEY_NAME, token);
};

export const getUsername = () => {
  return SecureStorage.getItemAsync(USERNAME_KEY_NAME);
};

export const deleteToken = () => {
  return SecureStorage.deleteItemAsync(TOKEN_KEY_NAME);
}

export const setUsername = (username) =>{
    SecureStorage.setItemAsync(USERNAME_KEY_NAME,username);
}

export const deleteUsername = (username) =>{
  return SecureStorage.deleteItemAsync(USERNAME_KEY_NAME);
}

export const setTeam = (team) => {
    return SecureStorage.setItemAsync(TEAM_KEY_NAME,team);
}

export const getTeam = () => {
    return SecureStorage.getItemAsync(TEAM_KEY_NAME);
}
