import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import EventPodium from './EventPodium.js';
import {styles} from './style.js';

class EventSummary extends Component {
    render(){
        return(
            <View>
                <EventPodium teams={["Windy","Terra","Ocean"]}/>
            </View>
        );
    }
}

export default EventSummary;