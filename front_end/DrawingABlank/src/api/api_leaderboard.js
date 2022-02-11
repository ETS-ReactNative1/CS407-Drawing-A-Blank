import { request, getToken } from "./api_networking.js";

export const getPointsLeaderboard = () =>{
    return getToken().then(token => request('GET','/leaderboards/points','','',token)).then(response => {
        if(response.status != 200){
            throw new Error('Could not obtain points leaderboard.');
        }
        return response.json();
    });
}

export const getDistanceLeaderboard = (date) =>{
    body = {
        "date":date
    };
    return getToken().then(token => request('POST','/leaderboard/distance/','','',token)).then(response => {
        if(response.status != 200){
            throw new Error('Could not obtain distance leaderboard.');
        }
        return response.json();
    });
}