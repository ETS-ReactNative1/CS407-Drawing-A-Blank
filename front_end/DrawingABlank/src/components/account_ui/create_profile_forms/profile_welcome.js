import React, {Component} from "react";
import {StyleSheet, Text, View, Button, TextInput,Alert, BackHandler} from "react-native";
import { styles } from "./style.js";


class ProfileWelcome extends Component{
    state={
        username:this.props.route.params.username,
        password:this.props.route.params.password,
        email:this.props.route.params.email
    }
    StartCreatingProfile = () =>{
        this.props.navigation.navigate("ProfileTeam",this.state);
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
                    <Text style={styles.title_text}>Welcome to Fresgo!</Text>
                </View>
                <View style={styles.welcome_view}>
                    <Text style={styles.welcome_text}>
                    Before you begin your colourful journey of exercise, we would appreciate if you took some time to set up your profile. 
                    Don't worry, we will guide you through the process as quickly as possible so you can get to exercising!
                    </Text>
                </View>
                <View style={styles.create_profile}>
                    <Button title="Let's fresgo!" color="#6db0f6" onPress={this.StartCreatingProfile}/>
                </View>
            </View>
        );
    }
}


export default ProfileWelcome;