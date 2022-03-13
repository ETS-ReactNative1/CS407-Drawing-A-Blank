import React, {Component} from "react";
import {Text, View, Button, Image, BackHandler, Alert, TouchableOpacity} from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { styles } from "../tutorial_screens/style.js";
import { getUsername } from "../../../api/api_networking.js";

class EventTutorial extends Component{
    continueToNextTutorial = () =>{
        this.props.navigation.navigate('leaderboard_tutorial')
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
                    <Text style={styles.title_text}>Events</Text>
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
                        Events are time-limited areas within your vicinity that can provide special rewards for you and your team members. If you workout over this event area, you will be classed as a participant. You can view events within your area within the map, and click on their pin to view more information. 
                        You can also view the events that you have participated in, and their final outcomes, in the event history screen.
                    </Text>
                </View>
                <View style={styles.pictures}>
                    <Image
                        source={require('../../../assets/img/eventexample.png')}
                        style={{width:192,height:192}}
                    />
                </View>
                <View style={styles.continue_button}>
                    <View style={styles.button_style}>
                        <Button title="Back" color="#6db0f6" onPress={this.goBack}/>
                    </View>
                    <View style={styles.button_style}>
                        <Button title="Next" color="#6db0f6" onPress={this.continueToNextTutorial}/>
                    </View>
                </View>
            </View>
        );
    }
}

export default EventTutorial;