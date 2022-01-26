import { request, getToken } from "./api_networking";

export const submit_workout = (workout_json) => {
    return getToken().then(token=>request('POST','workout/','',JSON.stringify(workout_json),token))
    .then(response => {console.log(response);response.json()})
    .then(data => console.log(data))
    .catch(err => console.log(err))
} 