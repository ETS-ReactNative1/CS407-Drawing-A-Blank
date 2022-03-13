import React, {Component} from "react";
import {Text, View, Button, Image, BackHandler, Alert, TouchableOpacity} from "react-native";
import { Icon } from "react-native-elements/dist/icons/Icon";
import { styles } from "../tutorial_screens/style.js";

class MapTutorial extends Component{
    continueToNextTutorial = () =>{
        this.props.navigation.navigate('workout_tutorial')
    }
    skipTutorial(){
        Alert.alert("Skip Tutorial","Are you sure you want to skip this tutorial? You can revisit it later in the settings panel.",
        [
            {text:'Yes',onPress:()=>this.props.navigation.navigate('loading_screen',{username:this.state.name})},
            {text:'No',onPress:()=>{}}
        ])
    }
    render(){
        return(
            <View style={styles.main}>
                <View style={styles.title}>
                    <Text style={styles.title_text}>How to play</Text>
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
                    <View style={{width:"100%"}}>
                        <Button title="Next" color="#6db0f6" onPress={this.continueToNextTutorial}/>
                    </View>
                </View>
            </View>
        );
    }
}

export default MapTutorial;