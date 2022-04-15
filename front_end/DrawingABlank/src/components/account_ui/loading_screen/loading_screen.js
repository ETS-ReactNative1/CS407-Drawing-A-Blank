import React, {Component} from 'react';
import {Text, View, TextInput, Button, TouchableOpacity, Touchable, ActivityIndicator, Alert} from 'react-native';
import {styles} from './style.js';
import Geolocation from 'react-native-geolocation-service';
import {getEvents} from '../../../api/api_events.js';
import {getGrids} from '../../../api/api_grids.js';
import {requestLocationPermission} from '../../mapView/permissions.js';
const DEBUG_ZOOM_LEVEL = 0.01;
class LoadingScreen extends Component{
    state={
        loading_text:"Obtaining location",
        events_result:[],
    }
    componentDidMount(){
        //Perform requests here. Requests to do: get map info and get events (maybe cache workout history and event history?)*
        requestLocationPermission().then(granted => {
            if(granted){
                    this.setState({loading_text:"Retrieving event info"},_ => {
                        getEvents().then(res => {
                            this.setState({events_result:res, loading_text:"Launching map"}, _ => {
                                console.log("NAVIGATING WITH:"+this.state);
                                this.props.navigation.navigate('map_view_complete',this.state);
                            });
                        }).catch(err => {
                            Alert.alert("Error","Sorry, we could not connect you to our servers. Please try again later, or send this to our code monkeys.\n"+err);
                            this.props.navigation.navigate('login_screen');
                        });
                    })
                    
        }});
    }
    render(){
        return(
            <View style={styles.mainContainer}>
                <View style={styles.loading_box}>
                    <Text style={styles.loading_text_title}>Welcome {this.props.route.params.username}</Text>
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