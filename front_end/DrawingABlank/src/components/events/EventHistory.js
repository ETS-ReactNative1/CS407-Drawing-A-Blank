import React, {Component} from 'react';
import {Text, View, TextInput, Button, TouchableOpacity, Touchable, ActivityIndicator, Alert} from 'react-native';
import {styles} from './event_history_style.js';
import { ScrollView } from 'react-native-gesture-handler';
import EventCard from './EventCard.js';
import { getEventHistory } from '../../api/api_events.js';

class EventHistory extends Component{
    state={
        obtainedEvents:[],
        victories:0,
        defeats:0,
        points:0,
        collectedEvents:false
    }
    
    determineTeamWinner = (event_scores) =>{
        if(event_scores.ocean > event_scores.windy && event_scores.ocean > event_scores.terra){
            return "ocean";
        }else if(event_scores.windy > event_scores.ocean && event_scores.windy > event_scores.terra){
            return "windy";
        }else if(event_scores.terra > event_scores.ocean && event_scores.terra > event_scores.windy){
            return "terra";
        }else{
            return "draw";
        }
    }

    getPointsTotal = () =>
    {
        //After determining how to get the user's team colour stored locally, update this function
        return this.state.obtainedEvents.map(event => event.performance.user).reduce((prev,tot) => prev+tot);
    }

    getVictoryTotal = (team) =>{
        return this.state.obtainedEvents.map(event => this.determineTeamWinner(event.performance)==team ? 1 : 0).reduce((prev,tot) => prev+tot);
    }

    getLossesTotal = (team) =>{
        return this.state.obtainedEvents.map(event => this.determineTeamWinner(event.performance)==team ? 0 : 1).reduce((prev,tot) => prev+tot);
    }

    getDrawersTotal = (team) =>{
        return Math.abs(this.getVictoryTotal(team) - this.getLossesTotal(team));
    }

    componentDidMount(){
        getEventHistory().then(result => {
            console.log("GOT EVENT HISTORY:"+JSON.stringify(result));
            this.setState({obtainedEvents:result},()=>{
                //Calculate vicotires, losses and scores
                this.setState({points:this.getPointsTotal()},()=>{
                    //Calculate victories and losses here
                    this.setState({collectedEvents:true});
                })
            })
        });
    }

    render(){
        return(
            <View style={styles.main}>
                {this.state.collectedEvents ? 
                (<View>
                <View style={styles.window_title}>
                    <Text style={styles.window_title_text}>Event History</Text>
                </View>
                <View style={styles.score_summary}>
                    <Text style={styles.score_victories}>9 victories</Text>
                    <Text style={styles.score_defeats}>5 defeats</Text>
                    <Text style={styles.score_points}>123 points</Text>
                </View>
                <ScrollView style={styles.event_board}>
                    {/**Later the user_team prop can be replaced with getting it directly from storage. */}
                    <EventCard points_terra={23} points_ocean={42} points_windy={32} points_user={3} team_user='ocean' date="21st February 2022 13:42 - 23rd February 2022 13:42"/>
                    <EventCard points_terra={12} points_ocean={42} points_windy={5} points_user={6} team_user='ocean' date="21st February 2022 13:42 - 23rd February 2022 13:42"/>
                    <EventCard points_terra={45} points_ocean={23} points_windy={455} points_user={7} team_user='ocean' date="21st February 2022 13:42 - 23rd February 2022 13:42"/>
                    <EventCard points_terra={1} points_ocean={132} points_windy={1} points_user={1} team_user='ocean' date="21st February 2022 13:42 - 23rd February 2022 13:42"/>
                    <EventCard points_terra={233} points_ocean={45} points_windy={1} points_user={12} team_user='ocean' date="21st February 2022 13:42 - 23rd February 2022 13:42"/>
                    <EventCard points_terra={34} points_ocean={32} points_windy={2} points_user={5} team_user='ocean' date="21st February 2022 13:42 - 23rd February 2022 13:42"/>
                </ScrollView>
                </View>) : <View><ActivityIndicator color="#fafafa" size="large"/></View>}
            </View>
        )
    }
}

export default EventHistory;