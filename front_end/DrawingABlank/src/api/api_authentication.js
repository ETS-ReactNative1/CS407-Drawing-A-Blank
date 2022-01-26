import { request, setToken } from "./api_networking.js";

export const createUser = (username, email, password, team) => {
    body = {
        "username":username,
        "email":email,
        "password":password,
        "team":team
    };
    console.log("Sending create user request with " + JSON.stringify(body));
    return request('POST','user/','',JSON.stringify(body))
    .then(response=>response.json())
    .catch(err => {console.log("ERROR:"+err);err});
}

export const authenticateUser = (username,password) => {
    body = {
        "username":username,
        "password":password
    };
    console.log('Sending authentication request with ' + JSON.stringify(body));
    return request('POST','api-token-auth/','',JSON.stringify(body))
    .then(response=>{
        if(response.status != 200){
            throw new Error('Incorrect credentials.');
        }
        return response.json();
    }).then(res => setToken(res.token));
}