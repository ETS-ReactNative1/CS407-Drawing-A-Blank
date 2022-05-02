import {
  request,
  setToken,
  getToken,
  setUsername,
  setTeam,
} from './api_networking.js';
import {getProfile} from './api_profile.js';

//Create a user and obtain a token if successful
export const createUser = (username, email, password, team) => {
  body = {
    username: username,
    email: email,
    password: password,
    team: team,
  };
  console.log('Sending create user request with ' + JSON.stringify(body));
  return request('POST', 'user/', '', JSON.stringify(body))
    .then(response => {
      if (response.status != 201) {
        throw new Error(JSON.stringify(response.json()));
      }
      return response.json();
    })
    .then(res => {
      console.log('GOT TOKEN RESPONSE:' + JSON.stringify(res));
      setToken(res.token);
      setUsername(username);
    });
};
//Authenticate a user with a username and password for an initial sign-in
export const authenticateUser = (username, password) => {
  body = {
    username: username,
    password: password,
  };
  console.log('Sending authentication request with ' + JSON.stringify(body));
  return request('POST', 'auth/', '', JSON.stringify(body))
    .then(response => {
      if (response.status != 200) {
        console.log(response);
        console.log(response.status);
        throw new Error('Incorrect credentials.');
      }
      return response.json();
    })
    .then(res => setToken(res.token))
    .then(_ => setUsername(username))
    .then(_ => {
      getProfile(username).then(res => {
        setTeam(res.team);
      });
    });
};
//Verify a user token, typically done whenever the user opens the app and has a token stored on their device.
//If the token is valid, they will be automatically signed in.
export const verifyToken = () => {
  return getToken()
    .then(tok => {
      console.log('Token:' + tok);
      return request('PATCH', 'token/verify_token/', '', '', tok);
    })
    .then(resp => {
      console.log(resp.status);
      if (resp.status == 200) {
        console.log('Returning true');
        return true;
      }
      console.log('Returning false');
      return false;
    });
};
//Log out of the application.
export const logout = () => {
  return getToken()
    .then(tok => request('DELETE', 'token/log_out/', '', '', tok))
    .then(response => {
      if (response.status == 200) {
        return true;
      }

      return false;
    });
};
