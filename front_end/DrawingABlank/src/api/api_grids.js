import { request, getToken } from "./api_networking.js";

export const getGrids = (bottom_left, top_right) => {
    body = {
        "bottom_left":bottom_left,
        "top_right":top_right,
        "zoom":10
    };
    console.log("Sending grid window request with:"+JSON.stringify(body));
    return getToken().then(token => request('POST','map/collect/','',JSON.stringify(body),token))
    .then(response => response.json())
    .catch(err => console.log("ERROR IN GRIDS:"+err));
}