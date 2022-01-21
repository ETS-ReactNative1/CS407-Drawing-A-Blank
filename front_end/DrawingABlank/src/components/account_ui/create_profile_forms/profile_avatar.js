import React, {Component} from "react";
import {useState} from "react";
import {Text, View, Button, Image, BackHandler} from "react-native";
import { styles } from "./style";
import { launchImageLibrary } from 'react-native-image-picker';
import {updateProfile} from '../../../api/api_profile.js';

class ProfileAvatar extends Component{
    state={
        avatar:''
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
    createProfile = (username,profile_name,date_of_birth,gender,height,weight) => {
        var first_name = profile_name.split(' ')[0];
        var last_name = (profile_name.split(' ').length > 1) ? profile_name.splt(' ')[1] : "";
        //Check what token is required here
        updateProfile(username,'',age=date_of_birth,gender=gender,first_name=first_name,last_name=last_name,height=height,weight=weight).then(resp=>{
            this.goToMap();
        }).catch(err => alert(err));
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
                    <Button title="Create Profile" color="#6db0f6" onPress={this.goToMap}/>
                </View>
            </View>
        )
    }
}

export default ProfileAvatar;