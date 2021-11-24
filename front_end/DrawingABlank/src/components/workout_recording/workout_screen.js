import React, {Component, useState} from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Geolocation from 'react-native-geolocation-service';
import { Workout } from './workout';
import { styles } from './workout_style';

const recorder = new Workout();

class WorkoutScreen extends Component{
    
    state = {
        recording : false,
        button_text: "Start workout",
    };
    componentDidMount(){
        this.watchID = Geolocation.watchPosition(
            position => {
                console.log("New coordinate");
                const {lat, lon} = position.coords;
                if(this.state.recording){
                    recorder.addCoordinate(lat,lon);
                }
            },error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        )
    }
    updateButton(){
        if(!this.state.recording){
            recorder.startWorkout();
            this.setState({
                recording : true,
                button_text : "Stop workout"
            });
            Geolocation.getCurrentPosition(({coords}) => recorder.addCoordinate(coords.latitude,coords.longitude));
        }else{
            recorder.stopWorkout();
            this.setState({
                recording : false,
                button_text : "Start workout"
            })
            console.log(recorder.toJSON());
        }
    }
    render(){
        return(
            <View style={{alignItems:"center",marginTop:300}}>
                <TouchableOpacity style={styles.workout_button}>
                    <Text style={styles.workout_button_text} onPress={() => this.updateButton()}>{this.state.button_text}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default WorkoutScreen;