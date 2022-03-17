import React, {Component} from "react";
import {Text, View, Button, Image, BackHandler, Alert, TouchableOpacity} from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { getUsername } from "../../../api/api_networking.js";
import { styles } from "../tutorial_screens/style.js";

class LeaderboardTutorial extends Component{
    continueToNextTutorial = () =>{
        this.props.navigation.navigate('tutorial_location');
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
                    <Text style={styles.title_text}>Leaderboards</Text>
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
                        You can view your ranking for the game season compared to other players in the leaderboard screen. You can comapre either the points gained overall (i.e. from events) or the total distance travelled through workouts.
                    </Text>
                </View>
                <View style={styles.pictures}>
                    {/*This image should maybe be changed to be either more professional or reflect results from a second UI pass. */}
                    <Image
                        source={require('../../../assets/img/leaderboard.png')}
                        style={{width:192,height:256}}
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

export default LeaderboardTutorial;