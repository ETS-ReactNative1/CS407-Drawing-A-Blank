import { request } from "./api_networking";

export const submit_workout = (workout_json) => {
    return request('POST','record-workout/','',JSON.stringify(workout_json))
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
} 