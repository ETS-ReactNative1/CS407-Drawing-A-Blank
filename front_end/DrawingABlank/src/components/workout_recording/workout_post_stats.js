import React, {Component, useState} from 'react';
import { Button, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Geolocation from 'react-native-geolocation-service';
import { Workout } from './workout';
import { styles } from './workout_style';
import WorkoutLineGraph from '../profile/personal_stats/graph/line_graph.js';
import ExtraData from '../profile/personal_stats/extra_data.js';

class WorkoutPostStats extends Component{
    recorder = this.props.recorder;
    state = {
        recording : false,
        button_text: "Start workout",
        extra_data: [],
        speed_time: this.recorder.getSpeedvsTime(),
        distance_time: this.recorder.getDistanceVsTime(),
        debug_text: "",
    };
    componentDidMount(){
    }
    getExtraData(){
        var result = [
            {
                "title":"Average Speed",
                "value":this.recorder.getAverageSpeed().toFixed(3)+'m/s',
                "key":0
            },
            {
                "title":"Total Distance",
                "value":this.recorder.getTotalDistance().toFixed(3)+'m',
                "key":1
            },
            {
                "title":"Started At",
                "value":this.recorder.date_start.toLocaleString(),
                "key":2,
            },
            {
                "title":"Finished At",
                "value":this.recorder.date_end.toLocaleString(),
                "key":3,
            }
        ];
        console.log("Returning " + JSON.stringify(result));
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
                extra_data: this.getExtraData(),
                speed_time: recorder.getSpeedvsTime(),
                distance_time: recorder.getDistanceVsTime()
            });
        }
    }
    getSpeedVsTimeGraph(){
        this.state.speed_time = this.recorder.getSpeedvsTime();
        return (
            <WorkoutLineGraph 
                graphTitle="Speed (m/s) vs. Time (s)"
                yData={this.state.speed_time.map(value => value.speed)}
                xFunction={(value, index) => this.state.speed_time[index].time.toFixed(1)}
                height={250}
            />
        );
    }
    getDistanceVsTimeGraph(){
        this.state.distance_time = this.recorder.getDistanceVsTime();
        return (
            <WorkoutLineGraph 
                graphTitle="Distance (m) vs. Time (s)"
                yData={this.state.distance_time.map(value => value.distance)}
                xFunction={(value, index) => this.state.distance_time[index].time.toFixed(1)}
                height={250}
            />
        );
    }
    renderExtraData(){
        this.state.extra_data = this.getExtraData();
        return (
            <ExtraData data={this.state.extra_data}/>
        )
    }
    render(){
        return(
            <ScrollView style={{paddingBottom:20}}>
                <View style={{alignItems:"center",marginTop:20}}>
                    <Text style={styles.workout_button_text}>Post-Workout Summary</Text>
                    <Text style={{fontSize:16}}>Workout completed! Good job, your workout has been saved to Fresgo's servers. Here are your post-workout statistics.</Text>
                    <View style={{marginTop:20, width:"90%"}}>
                        { this.getSpeedVsTimeGraph() }
                        { this.getDistanceVsTimeGraph() }
                        { this.renderExtraData() }
                    </View>
                </View>
            </ScrollView>
        )
    }
}

export default WorkoutPostStats;