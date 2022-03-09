import React, {Component} from 'react';
import {Text, View, ScrollView, TouchableOpacity} from 'react-native';
import EventPodium from './EventPodium.js';
import WorkoutLineGraph from '../profile/personal_stats/graph/line_graph.js';
import {styles} from './style.js';
import { LineChart, Path, Grid } from 'react-native-svg-charts'

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
        const TEAM_COLOURS = {"Terra":"#FF8C91","Windy":"#82FF8A","Ocean":"#47C4FF"}
        const LINE_DATA = [
            {
                data:this.props.score_history[0],
                svg:{stroke:TEAM_COLOURS[this.props.teams[0]], strokeWidth:2}
            },
            {
                data:this.props.score_history[1],
                svg:{stroke:TEAM_COLOURS[this.props.teams[1]], strokeWidth:2}
            },
            {
                data:this.props.score_history[2],
                svg:{stroke:TEAM_COLOURS[this.props.teams[2]], strokeWidth:2}
            },
        ];
        console.log(LINE_DATA);
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
                <WorkoutLineGraph
                    graphTitle="Team Points vs. Time"
                    yData={LINE_DATA}
                    xFunction={(value, index) => {}}
                    height={200}
                />
                <TouchableOpacity style={styles.continue_button}>
                    <Text style={styles.continue_button_text} onPress={()=>{}}>Continue</Text>
                </TouchableOpacity>
                <View style={{padding:20}}></View>
            </ScrollView>
        );
    }
}

export default EventSummary;