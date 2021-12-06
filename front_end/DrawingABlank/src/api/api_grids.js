import { request } from "./api_networking.js";

export const getGrids = (bottom_left, top_right) => {
    body = {
        "bottom_left":bottom_left,
        "top_right":top_right,
        "bottom_right":0,
        "top_left":0
    };
    console.log("Sending grid window request with:"+JSON.stringify(body));
    return request('POST','grid-window/','',JSON.stringify(body))
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log("ERROR:"+err));
}