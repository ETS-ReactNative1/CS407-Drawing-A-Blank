import React, {Component} from 'react';
import {Text, View, TextInput, Button, TouchableOpacity, Touchable, ActivityIndicator, Alert} from 'react-native';
import {styles} from './event_history_style.js';
import { ScrollView } from 'react-native-gesture-handler';
import EventCard from './EventCard.js';

class EventHistory extends Component{
    render(){
        return(
            <View style={styles.main}>
                <View style={styles.window_title}>
                    <Text style={styles.window_title_text}>Event History</Text>
                </View>
                <View style={styles.score_summary}>
                    <Text style={styles.score_victories}>9 victories</Text>
                    <Text style={styles.score_defeats}>5 defeats</Text>
                    <Text style={styles.score_points}>123 points</Text>
                </View>
                <ScrollView style={styles.event_board}>
                    <EventCard/>
                    <EventCard/>
                    <EventCard/>
                    <EventCard/>
                    <EventCard/>
                    <EventCard/>
                    <EventCard/>
                    <EventCard/>
                </ScrollView>
            </View>
        )
    }
}

export default EventHistory;