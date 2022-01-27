import { request, getToken } from "./api_networking.js";

export const getGrids = (bottom_left, top_right) => {
    body = {
        "bottom_left":bottom_left,
        "top_right":top_right,
        "zoom":1
    };
    console.log("Sending grid window request with:"+JSON.stringify(body));
    return getToken().then(token => request('POST','map/collect/','',JSON.stringify(body),token))
    .then(response => {
        if(response.status != 200){
            throw new Error('Could not retrieve grids.');
        }
        return response.json();
    });
}