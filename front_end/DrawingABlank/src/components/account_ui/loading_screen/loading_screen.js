import React, {Component} from 'react';
import {Text, View, TextInput, Button, TouchableOpacity, Touchable, ActivityIndicator} from 'react-native';
import {styles} from './style.js';
import Geolocation from 'react-native-geolocation-service';
import {getEvents} from '../../../api/api_events.js';
import {getGrids} from '../../../api/api_grids.js';
const DEBUG_ZOOM_LEVEL = 0.01;
class LoadingScreen extends Component{
    state={
        loading_text:"Obtaining location",
        events_result:[],
        map_result:[],
    }
    componentDidMount(){
        //Perform requests here. Requests to do: get map info and get events (maybe cache workout history and event history?)*

        Geolocation.getCurrentPosition(({coords}) => {
            this.setState({loading_text:"Obtaining map info"});
            getGrids(`${coords.latitude - DEBUG_ZOOM_LEVEL},${coords.longitude - DEBUG_ZOOM_LEVEL}`
            ,`${coords.latitude + DEBUG_ZOOM_LEVEL},${coords.longitude + DEBUG_ZOOM_LEVEL}`)
            .then(result => {this.setState({map_result:result, loading_text:"Retrieving event info"});console.log("GRID AMOUNT:"+result.length)})
            .then(_ => {
                getEvents().then(res => {
                    this.setState({events_result:res, loading_text:"Done"});
                });
            });
        });
    }
    render(){
        return(
            <View style={styles.mainContainer}>
                <View style={styles.loading_box}>
                    <Text style={styles.loading_text_title}>Welcome {this.props.username}</Text>
                    <View style={styles.loading_icon}>
                        <ActivityIndicator color='#6db0f6' size='large'/>
                    </View>
                    <Text style={styles.loading_text_description}>{this.state.loading_text}</Text>
                </View>
            </View>
        );
    }
}

export default LoadingScreen;