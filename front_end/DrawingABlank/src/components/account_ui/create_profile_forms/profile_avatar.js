import React, {Component} from "react";
import {useState} from "react";
import {Text, View, Button, Image, BackHandler} from "react-native";
import { styles } from "./style";
import { launchImageLibrary } from 'react-native-image-picker';

class ProfileAvatar extends Component{
    state={
        avatar:'https://static.wikia.nocookie.net/vocaloid/images/5/57/Miku_v4_bundle_art.png'
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
            if(!result.didCancel && !result.errorCode){
                this.setState({avatar:result.assets[0].uri});
            }
        })
        
    }
    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress',function (){
            //Prevents going back
            return true;
        });
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
                    <Text style={styles.form_input_title}>Select an avatar to go with your profile. If you do not pick a profile picture, we will give you a cute mascot for your team instead.</Text>
                </View>
                <Image
                    style={styles.avatar}
                    source={{uri:this.state.avatar}}
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