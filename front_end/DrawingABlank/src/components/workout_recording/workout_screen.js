import React, {Component, useState} from 'react';
import { Button, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Geolocation from 'react-native-geolocation-service';
import { Workout } from './workout';
import { styles } from './workout_style';

const recorder = new Workout();

class WorkoutScreen extends Component{
    
    state = {
        recording : false,
        button_text: "Start workout",
        detail_text: "No workout data",
        debug_text: "",
    };
    updateDebugText(coords){
        var time = new Date();
        this.setState({
            debug_text:coords.latitude + "," + coords.longitude + " at " + time,
        })
    }
    getLocation(){
        //Geolocation.getCurrentPosition(({coords}) => this.updateDebugText(coords));
        
    }
    componentDidMount(){
        this.watchID = Geolocation.watchPosition(
            position => {
                if(this.state.recording){
                    recorder.addCoordinate(position.coords.latitude,position.coords.longitude);
                }
            },error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        )
        
        setInterval(() => {
            Geolocation.getCurrentPosition(({coords}) => this.updateDebugText(coords),error=>console.log(error),{enableHighAccuracy:true,timeout:20000,maximumAge:1000});
        },1000);
    }
    getDetailText(){
        var result = "";
        result += "Started at:" + recorder.date_start;
        result += "\nFinished at:" + recorder.date_end;
        result += "\nCoordinates visited:\n";
        for(var c=0;c<recorder.coordinates.length;c++){
            result+="("+recorder.coordinates[c].latitude+","+recorder.coordinates[c].longitude+") at " + recorder.coordinates[c].timestamp+"\n";
        }
        result += "\nAverage speed:"+recorder.getAverageSpeed()+"m/s\n";
        result += "\Total distance:"+recorder.getTotalDistance()+"m\n";
        result += "Speed vs Time JSON:" + JSON.stringify(recorder.getSpeedvsTime()) + "\n";
        result += "Distance vs Time JSON:" + JSON.stringify(recorder.getDistanceVsTime()) + "\n";
        return result;
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
                button_text : "Start workout",
                detail_text : this.getDetailText()
            })
            console.log(recorder.toJSON());
        }
    }
    render(){
        return(
            <View style={{alignItems:"center",marginTop:100}}>
                <TouchableOpacity style={styles.workout_button}>
                    <Text style={styles.workout_button_text} onPress={() => this.updateButton()}>{this.state.button_text}</Text>
                </TouchableOpacity>
                <View style={{marginTop:100}}>
                    <Text>
                        Debug text: {this.state.debug_text}
                    </Text>
                    <Text>
                        {this.state.detail_text}
                    </Text>
                </View>
            </View>
        )
    }
}

export default WorkoutScreen;