import { request, getToken } from "./api_networking";

export const submit_workout = (workout_json) => {
    return getToken().then(token=>request('POST','workout/','',JSON.stringify(workout_json),token))
    .then(response => {
        if(response.status != 201){
            throw new Error('Failed to add workout.');
        }
        response.json()
    });
} 