import * as SecureStorage from 'expo-secure-store';

//These are just sample constants for now, update once we have back-end running.
const API_HOSTNAME = 'drawab.dcs.warwick.ac.uk';
const API_PORT_NUMBER = '443';
const API_SUFFIX = '/'; //Example only
const API_URL = 'https://' + API_HOSTNAME + ':' + API_PORT_NUMBER + API_SUFFIX;
const TOKEN_KEY_NAME = 'fresgo_access_token';
const TEAM_KEY_NAME = 'fesgo_team';
const USERNAME_KEY_NAME = 'fresgo_username';
/**
 * Sends a request to the API at a specified endpoint and returns an async handler. This has not been tested yet, just writing this so that it is here.
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
    //For now let us just treat req_queries as a string, but later on we may want to use a more appropriate structure.
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

export const getUsername = () =>{
    return SecureStorage.getItemAsync(USERNAME_KEY_NAME);
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
