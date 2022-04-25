import React, {useState, Component} from 'react';
import PushNotification from 'react-native-push-notification';
import MapViewComplete from './MapViewComplete';
import * as Location from 'expo-location';


const TASK_NAME = 'FRESGO_GET_LOCATION';

class MapViewCompleteComponent extends Component {
    state={}
    componentDidMount(){
        PushNotification.cancelLocalNotification(0);
        console.log("On map view");
        console.log(this.props.route.params);
        if(Object.keys(this.state)==0){
            console.log("Changing state")
            this.setState(this.props.route.params);
        }
    }

    componentWillUnmount(){
    Location.hasStartedLocationUpdatesAsync(TASK_NAME).then(value => {
        if (value) {
            Location.stopLocationUpdatesAsync(TASK_NAME);
        }
        });
    }

    render(){
        return(
            <MapViewComplete props={Object.keys(this.state)==0 ? this.props.route.params : this.state}/>
        );
    }
}

export default MapViewCompleteComponent;