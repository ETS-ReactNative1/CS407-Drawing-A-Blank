import { NavigationRouteContext } from '@react-navigation/core';
import React, {Component} from 'react';
import {Text, View, TextInput, Button, TouchableOpacity, Touchable, ActivityIndicator, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {styles, buttons} from './style.js';

class EventHistory extends Component{
    render(){
        return(
            <View style={styles.main}>
                <View style={styles.window_title}>

                </View>
            </View>
        )
    }
}

export default EventHistory;