import React, {Component} from "react";
import {Text, View, Button, Image, BackHandler, Alert, TouchableOpacity} from "react-native";
import { getUsername } from "../../../api/api_networking.js";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { requestLocationPermission } from "../../mapView/permissions.js";
import { styles } from "../tutorial_screens/style.js";

class TutorialLocation extends Component{
    continueToNextTutorial = () =>{
        requestLocationPermission().then(granted => {
            if(granted){
                getUsername().then(username => {
                    this.props.navigation.navigate('loading_screen',{username:username});
                })
            }else{
                this.props.navigation.navigate('login_screen');
            }
        });
    }
    skipTutorial = () =>{
        Alert.alert("Skip Tutorial","Are you sure you want to skip this tutorial? You can revisit it later in the settings panel.",
        [
            {text:'Yes',onPress:()=>{
                getUsername().then(username => {                
                    this.props.navigation.navigate('loading_screen',{username:username});
                })
            }},
            {text:'No',onPress:()=>{}}
        ])
    }
    goBack = () =>{
        this.props.navigation.goBack();
    }
    render(){
        return(
            <View style={styles.main}>
                <View style={styles.title}>
                    <Text style={styles.title_text}>Final steps</Text>
                    <View style={styles.quit_button}>
                            <TouchableOpacity style={styles}>
                            <Icon
                                name={"x"}
                                type={"feather"}
                                size={30}
                                color={"#fafafa"}
                                onPress={this.skipTutorial}
                            />
                            </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.description}>
                    {/*For the season, we should probably state how long a season is here. */}
                    <Text style={styles.description_text}>
                        You are now almost ready to start playing. The last thing we need to ask you to do is to allow us to use your background location for your workouts. 
                        Your background location will only be used when the app is open and recording a workout, and you can still record a workout without exposing your location to other users using ghost mode.
                    </Text>
                </View>
                <View style={styles.continue_button}>
                    <View style={styles.button_style}>
                        <Button title="Back" color="#6db0f6" onPress={this.goBack}/>
                    </View>
                    <View style={styles.button_style}>
                        <Button title="Allow and continue" color="#6db0f6" onPress={this.continueToNextTutorial}/>
                    </View>
                </View>
            </View>
        );
    }
}

export default TutorialLocation;