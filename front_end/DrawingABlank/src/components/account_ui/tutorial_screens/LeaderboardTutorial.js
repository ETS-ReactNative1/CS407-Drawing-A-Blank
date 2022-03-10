import React, {Component} from "react";
import {Text, View, Button, Image, BackHandler, Alert} from "react-native";
import { styles } from "../tutorial_screens/style.js";

class LeaderboardTutorial extends Component{
    continueToNextTutorial = () =>{
        this.props.navigation.navigate('tutorial_location');
    }

    render(){
        return(
            <View style={styles.main}>
                <View style={styles.title}>
                    <Text style={styles.title_text}>Leaderboards</Text>
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
                    <Button title="Next" color="#6db0f6" onPress={this.continueToNextTutorial}/>
                </View>
            </View>
        );
    }
}

export default LeaderboardTutorial;