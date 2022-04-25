import React, {useState, Component} from 'react';
import PushNotification from 'react-native-push-notification';
import MapViewComplete from './MapViewComplete';

class MapViewCompleteComponent extends Component {
    state={}
    componentDidMount(){
        console.log("On map view");
        console.log(this.props.route.params);
        if(Object.keys(this.state)==0){
            console.log("Changing state")
            this.setState(this.props.route.params);
        }
    }

    componentWillUnmount(){
        PushNotification.cancelAllLocalNotifications();
    }

    render(){
        return(
            <MapViewComplete props={Object.keys(this.state)==0 ? this.props.route.params : this.state}/>
        );
    }
}

export default MapViewCompleteComponent;