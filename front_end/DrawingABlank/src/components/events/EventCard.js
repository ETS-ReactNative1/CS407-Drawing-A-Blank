import React, {Component} from 'react';
import {Text, View, TextInput, Button, TouchableOpacity, Image} from 'react-native';
import { styles } from './event_history_style.js';

class EventCard extends Component{
    state={
        default_pictures:{"ocean":require('../../assets/img/ocean.png'),"terra":require('../../assets/img/terra.png'),"windy":require('../../assets/img/windy.png')}
    }
    getDefaultPicture = (teamName) => {
        return this.state.default_pictures[teamName];
    }
    render(){
        return(
            <TouchableOpacity style={styles.event_card}>
                <View style={styles.winning_team}>
                    <Image
                        source={this.getDefaultPicture('ocean')}
                        style={styles.winning_team_picture}
                    />
                </View>
                <View style={styles.event_details}>
                    <View style={styles.event_scores}>
                        <Text style={styles.event_result_text}>Victory</Text>
                        <Text style={styles.event_score_text_sep}>  (</Text>
                        <Text style={styles.event_score_text_terra}>123</Text>
                        <Text style={styles.event_score_text_sep}>|</Text>
                        <Text style={styles.event_score_text_ocean}>23</Text>
                        <Text style={styles.event_score_text_sep}>|</Text>
                        <Text style={styles.event_score_text_windy}>152</Text>
                        <Text style={styles.event_score_text_sep}>)</Text>
                    </View>
                    <View style={styles.event_date}>
                        <Text style={styles.event_date_text}>21st February 2022 13:42 - 23rd February 2022 13:42</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export default EventCard;