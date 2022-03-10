import React, {Component} from "react";
import {Text, View, Button, Image, BackHandler, Alert} from "react-native";
import { styles } from "../tutorial_screens/style.js";

class WorkoutTutorial extends Component{
    continueToNextTutorial = () =>{
        this.props.navigation.navigate('event_tutorial');
    }

    render(){
        return(
            <View style={styles.main}>
                <View style={styles.title}>
                    <Text style={styles.title_text}>Performing workouts</Text>
                </View>
                <View style={styles.description}>
                    {/*For the season, we should probably state how long a season is here. */}
                    <Text style={styles.description_text}>
                        Workouts can be recorded by using the record button in the menu bar of the home screen. You can record three types of workouts: walking, running and cycling. You can also choose to enable ghost mode to disable your colour trail. Once you have completed a workout, you will be shown a summary of your workout, which you can also view within your workout history.
                    </Text>
                </View>
                <View style={styles.pictures}>
                    <Image
                        source={require('../../../assets/img/hotbar.png')}
                        style={{width:291,height:51,marginBottom:20}}
                    />
                    <Image
                        source={require('../../../assets/img/hotbar_recording.png')}
                        style={{width:291,height:51}}
                    />
                </View>
                <View style={styles.continue_button}>
                    <Button title="Next" color="#6db0f6" onPress={this.continueToNextTutorial}/>
                </View>
            </View>
        );
    }
}

export default WorkoutTutorial;