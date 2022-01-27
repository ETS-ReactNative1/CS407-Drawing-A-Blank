import React, {Component} from "react";
import {useState} from "react";
import {Text, View, Button, Image, BackHandler} from "react-native";
import { styles } from "./style";
import { launchImageLibrary } from 'react-native-image-picker';
import {updateProfile} from '../../../api/api_profile.js';

class ProfileAvatar extends Component{
    state={
        name:this.props.route.params.name,
        dateofbirth:this.props.route.params.dateofbirth,
        gender:this.props.route.params.gender,
        height:this.props.route.params.height,
        weight:this.props.route.params.weight,
        bio:this.props.route.params.bio,
        avatar:"",
        teamselection:this.props.route.params.teamSelection,
    }

    goToMap = () =>{
        this.props.navigation.navigate('map_view_complete');
    }

    openImages = () =>{
        const options = {
            storageOptions:{
                path: 'images',
                mediaType: 'photo'
            },
            selectionLimit: 1
        }
        launchImageLibrary(options,result=>{
            console.log("Got result:"+JSON.stringify(result));
            if(!result.didCancel && !result.errorCode){
                console.log("ADDING")
                this.setState({avatar:{'uri':result.assets[0].uri}});
            }
        })   
    }
    componentDidMount(){
        this.setState({avatar:this.getAvatarSource(this.props.route.params.teamselection)});
        BackHandler.addEventListener('hardwareBackPress',function (){
            //Prevents going back
            return true;
        });
        console.log(this.props.route.params);
    }
    getAvatarSource = (team) =>{
        if(team==="terra")
            return require('../../../assets/img/terra.png');
        if(team==="ocean")
            return require('../../../assets/img/ocean.png');
        if(team==="windy")
            return require('../../../assets/img/windy.png');
    }
    createProfile = (profile_name,date_of_birth,gender,height,weight) => {
        var first_name = profile_name.split(' ')[0];
        var last_name = (profile_name.split(' ').length > 1) ? profile_name.split(' ')[1] : "";
        //Code taken from: https://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
        var full_date_string = ('0' + date_of_birth.getDate()).slice(-2) + '/'
        + ('0' + (date_of_birth.getMonth()+1)).slice(-2) + '/'
        + date_of_birth.getFullYear();
        //Check what token is required here
        updateProfile(first_name,last_name,full_date_string,gender,height,weight).then(_=>{
            this.goToMap();
        }).catch(err => alert(err));
    }
    completeRegistration = () => {
        this.createProfile(this.state.name, this.state.dateofbirth, this.state.gender, this.state.height, this.state.weight);
    }
    render(){
        return(
            <View style={styles.main}>
                <View style={styles.welcome_title}>
                    <Text style={styles.title_text}>Profile Picture</Text>
                </View>
                <View style={styles.body_explanation}>
                    <Text style={styles.body_text}>"A picture paints a thousand words, or squares I suppose."</Text>
                </View>
                <View style={{width:"90%", paddingBottom:20}}>
                    <Text style={styles.form_input_title}>Select an avatar to go with your profile. If you do not pick a profile picture, the mascot from your team will take its place.</Text>
                </View>
                <Image
                    style={styles.avatar}
                    source={this.state.avatar}
                />
                <View style={styles.continue_button}>
                    <Button title="Choose Avatar" color="#6db0f6" onPress={this.openImages}/>
                </View>
                <View style={styles.continue_button}>
                    <Button title="Create Profile" color="#6db0f6" onPress={this.completeRegistration}/>
                </View>
            </View>
        )
    }
}

export default ProfileAvatar;