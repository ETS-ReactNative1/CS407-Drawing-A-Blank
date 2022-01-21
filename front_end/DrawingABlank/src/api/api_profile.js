import { request } from "./api_networking"

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
export const updateProfile = (username,token,old_password="",new_password="",first_name="",last_name="",age=null,gender="",height="",weight="") => {
    body={
        "username":username,
        "old_password":old_password,
        "new_password":new_password,
        "first_name":first_name,
        "last_name":last_name,
        "age":age,
        "gender":gender,
        "height":height,
        "weight":weight
    }
    //Check this URL later
    return request('POST','profile-update/','',JSON.stringify(body),token);
}