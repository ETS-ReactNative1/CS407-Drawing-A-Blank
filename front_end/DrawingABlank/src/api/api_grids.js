import { request, getToken } from "./api_networking.js";

export const getGrids = (bottom_left, top_right) => {
    query_string = `?bottom_left=${bottom_left}&top_right=${top_right}&zoom=10`
    console.log(query_string);
    return getToken().then(token => request('GET','map',query_string,'',token))
    .then(response => {
        if(response.status != 200){
            throw new Error('Could not retrieve grids.');
        }
        return response.json();
    });
}