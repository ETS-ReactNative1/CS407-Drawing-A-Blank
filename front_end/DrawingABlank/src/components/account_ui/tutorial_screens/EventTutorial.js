import React, {Component} from "react";
import {Text, View, Button, Image, BackHandler, Alert} from "react-native";
import { styles } from "../tutorial_screens/style.js";

class EventTutorial extends Component{
    continueToNextTutorial = () =>{
        this.props.navigation.navigate('leaderboard_tutorial')
    }

    render(){
        return(
            <View style={styles.main}>
                <View style={styles.title}>
                    <Text style={styles.title_text}>Events</Text>
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
                    <Button title="Next" color="#6db0f6" onPress={this.continueToNextTutorial}/>
                </View>
            </View>
        );
    }
}

export default EventTutorial;