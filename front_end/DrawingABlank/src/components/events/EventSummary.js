import React, {Component} from 'react';
import {Text, View, ScrollView} from 'react-native';
import EventPodium from './EventPodium.js';
import {styles} from './style.js';

class EventSummary extends Component {
    

    userIsWinner = () =>{
        return (this.props.personal_team == this.props.teams[0])
    }

    getStatusText = () =>{
        return (this.userIsWinner() ? "VICTORY" : "DEFEAT")
    }

    getDetailText = () =>{
        const text_winner = "Congratulations, your team won! You contributed " + this.props.personal_score + " points to this event.";
        const text_loser = "Your team did not win this event, better luck next time! You contributed " + this.props.personal_score + " points to this event.";
        return (this.userIsWinner() ? text_winner : text_loser);
    }

    render(){
        return(
            <ScrollView style={styles.summary}>
                <View style={styles.summary_title}>
                    <Text style={styles.summary_title_text}>Results for Event #{this.props.eventId}</Text>
                </View>
                <View style={styles.summary_status}>
                    <Text style={this.userIsWinner() ? styles.summary_status_winner : styles.summary_status_loser}>{this.getStatusText()}</Text>
                </View>
                <Text style={styles.summary_description_text}>{this.getDetailText()}</Text>
                <EventPodium 
                teams={this.props.teams}
                points={[300,200,100]}
                height={300}/>
            </ScrollView>
        );
    }
}

export default EventSummary;