import React, {Component} from "react";
import {Text, View, Button, Image, BackHandler, Alert} from "react-native";
import { styles } from "../tutorial_screens/style.js";

class MapTutorial extends Component{
    continueToNextTutorial = () =>{
        this.props.navigation.navigate('workout_tutorial')
    }

    render(){
        return(
            <View style={styles.main}>
                <View style={styles.title}>
                    <Text style={styles.title_text}>How to play</Text>
                </View>
                <View style={styles.description}>
                    {/*For the season, we should probably state how long a season is here. */}
                    <Text style={styles.description_text}>
                        The aim of Fresgo is to paint your local play area with your team's colour. This is done by doing workouts, which can involve walking, running or cycling. If you exercise over an empty area or an area of an opposing team, you will cover that area in your team's colour. At the end of each season, each team's members will be awarded according to their contribution, and the map will be wiped.
                    </Text>
                </View>
                <View style={styles.pictures}>
                    <Image
                        source={require('../../../assets/img/fresgomap.png')}
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

export default MapTutorial;