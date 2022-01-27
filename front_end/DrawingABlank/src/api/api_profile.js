import { request, getToken } from "./api_networking"

/*
        username = data["username"]
        old_password = data["old_password"]
        new_password = data["new_password"]
        first_name = data["first_name"]
        last_name = data["last_name"]
        age = data["age"]
        gender = data["gender"]
        height = data["height"]
        weight = data["weight"]
*/
export const updateProfile = (first_name="",last_name="",age="",gender="",height="",weight="") => {
    body={
        "first_name":first_name,
        "last_name":last_name,
        "date_of_birth":age,
        "gender":gender,
        "height":height,
        "weight":weight
    }
    //https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
    body = Object.fromEntries(Object.entries(body).filter(([_, v]) => v != ""));
    console.log("Sending profile update with:" + JSON.stringify(body));
    //Check this URL later
    return getToken().then(token => request('POST','user/change_details/','',JSON.stringify(body), token))
    .then(response => {
        if(response.status != 200 && response.status != 201){
            throw new Error('Could not update profile.');
        }
        response.json()
    });
}