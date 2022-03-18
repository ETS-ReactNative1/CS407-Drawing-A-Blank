import { request, getToken, getUsername } from "./api_networking";

/*
        username = data["username"]
        old_password = data["old_password"]
        new_password = data["new_password"]
        first_name = data["first_name"]
        last_name = data["last_name"]
        age = data["age"]
        gender = data["gender"]
        height = data["height"]
        weight = data["weight"]
*/
export const updateProfile = (
  first_name = '',
  last_name = '',
  age = '',
  gender = '',
  height = '',
  weight = '',
  user = '',
) => {
  body = {
    first_name: first_name,
    last_name: last_name,
    date_of_birth: age,
    gender: gender,
    height: height,
    weight: weight,
    user: user,
  };
  //https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
  body = Object.fromEntries(Object.entries(body).filter(([_, v]) => v != ''));
  console.log('Sending profile update with:' + JSON.stringify(body));
  //Check this URL later
  return getToken()
    .then(token =>
      request('PATCH', 'user/change_details/', '', JSON.stringify(body), token),
    )
    .then(response => {
      if (response.status != 200 && response.status != 201) {
        throw new Error('Could not update profile.');
      }
      return response.json();
    });
};

export const updateProfileQuick = body => {
  //https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
  body = Object.fromEntries(Object.entries(body).filter(([_, v]) => v != ''));
  console.log('Sending profile update with:' + JSON.stringify(body));
  //Check this URL later
  return getToken()
    .then(token =>
      request('PATCH', 'user/change_details/', '', JSON.stringify(body), token),
    )
    .then(response => {
      if (response.status != 200 && response.status != 201) {
        console.log(response.status);
        throw new Error('Could not update profile.');
      }
      console.log('updated?');
      return response.json();
    });
};

export const getProfile = username => {
  query = '?username=' + username;
  return getToken()
    .then(token => request('GET', 'user', query, '', token))
    .then(response => {
      if (response.status != 200 && response.status != 201) {
        console.log(response.status);
        throw new Error('Could not update profile.');
      }
      console.log('updated?');
      return response.json();
    });
};

export const getUserWorkouts = () => {
  let uname = '';
  getUsername().then(username => {
    if (username) {
      uname = username;
    }
  });
  return getToken()
    .then(token =>
      request('GET', 'workout/history/?username=', uname, '', token),
    )
    .then(response => {
      if (response.status != 200) {
        throw new Error(`Could not obtain workout_history. ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data) {
        // console.log('workout_history Got:' + JSON.stringify(data));
      }
      return data;
    });
};

export const getUserWorkout = id => {
  return getToken()
    .then(token => request('GET', 'workout?id=', `${id}`, '', token))
    .then(response => {
      if (response.status != 200) {
        throw new Error(`Could not obtain workout. ${response.status}`);
      }
      console.log('RESPONSE IS HERE:' + JSON.stringify(response));
      return response.json();
    });
};
