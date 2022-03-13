import React, {Component} from "react";
import {Text, View, Button, Image, BackHandler, Alert, TouchableOpacity} from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { styles } from "../tutorial_screens/style.js";

class WorkoutTutorial extends Component{
    continueToNextTutorial = () =>{
        this.props.navigation.navigate('event_tutorial');
    }
    skipTutorial(){
        Alert.alert("Skip Tutorial","Are you sure you want to skip this tutorial? You can revisit it later in the settings panel.",
        [
            {text:'Yes',onPress:()=>this.props.navigation.navigate('loading_screen',{username:this.state.name})},
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
                    <Text style={styles.title_text}>Performing workouts</Text>
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

export default WorkoutTutorial;