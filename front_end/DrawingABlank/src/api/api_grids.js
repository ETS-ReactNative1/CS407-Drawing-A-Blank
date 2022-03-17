import { request, getToken } from "./api_networking.js";

export const getGrids = (bottom_left, top_right) => {
  //NOTE THIS IS NOT UP TO DATE, CHANGING WITH MERGE
    query = "?bottom_left="+bottom_left+"&top_right="+top_right+"&zoom=10";
    console.log("Sending grid window request with:"+query);
    return getToken().then(token => request('GET','map',query,'',token))
    .then(response => {
        if(response.status != 200){
            throw new Error('Could not retrieve grids.');
        }
        return response.json();
    });
}