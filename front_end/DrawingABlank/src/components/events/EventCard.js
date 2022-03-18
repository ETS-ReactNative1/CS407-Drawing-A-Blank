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
    
    getWinnerTeamName = () => {
        if(this.props.points_terra > this.props.points_ocean && this.props.points_terra > this.props.points_windy){
            return 'terra';
        }
        else if(this.props.points_ocean > this.props.points_windy && this.props.points_ocean > this.props.points_terra){
            return 'ocean';
        }
        else if(this.props.points_windy > this.props.points_ocean && this.props.points_windy > this.props.points_terra){
            return 'windy';
        }else{
            //Draw, handle later
            return ''
        }
    }
    getWinnerImage = () => {
        return this.getDefaultPicture(this.getWinnerTeamName());
    }
    render(){
        return(
            <TouchableOpacity style={styles.event_card} onPress={this.props.onPress}>
                <View style={styles.winning_team}>
                    <Image
                        source={this.getWinnerImage()}
                        style={styles.winning_team_picture}
                    />
                </View>
                <View style={styles.event_details}>
                    <View style={styles.event_scores}>
                        {   (this.props.team_user==this.getWinnerTeamName()) ?
                            <Text style={styles.event_result_text_victory}>Victory</Text>
                            : <Text style={styles.event_result_text_defeat}>Defeat</Text>
                        }
                        <Text style={styles.event_score_text_sep}> (</Text>
                        <Text style={styles.event_score_text_terra}>{this.props.points_terra}</Text>
                        <Text style={styles.event_score_text_sep}>|</Text>
                        <Text style={styles.event_score_text_ocean}>{this.props.points_ocean}</Text>
                        <Text style={styles.event_score_text_sep}>|</Text>
                        <Text style={styles.event_score_text_windy}>{this.props.points_windy}</Text>
                        <Text style={styles.event_score_text_sep}>|</Text>
                        <Text style={styles.event_score_text_user}>{this.props.points_user}</Text>
                        <Text style={styles.event_score_text_sep}>)</Text>
                    </View>
                    <View style={styles.event_date}>
                        <Text style={styles.event_date_text}>{this.props.date}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export default EventCard;