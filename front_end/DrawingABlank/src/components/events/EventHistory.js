import React, {Component} from 'react';
import {Text, View, TextInput, Button, TouchableOpacity, Touchable, ActivityIndicator, Alert} from 'react-native';
import {styles} from './event_history_style.js';
import { ScrollView } from 'react-native-gesture-handler';
import EventCard from './EventCard.js';
import { getEventHistory } from '../../api/api_events.js';
import { getTeam } from '../../api/api_networking.js';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Icon } from 'react-native-elements/dist/icons/Icon';

class EventHistory extends Component{
    state={
        obtainedEvents:[],
        victories:0,
        defeats:0,
        points:0,
        collectedEvents:false,
        userTeam:"",
        showDatePicker:false,
    }
    
    setDate = (date) =>{
        this.hideDatePicker();
        this.setState({collectedEvents:false},()=>{this.getEvents(date.toLocaleString('en-GB').split(',')[0])});
    }

    showDatePicker = () =>{
        this.setState({showDatePicker:true});
    }

    hideDatePicker = () =>{
        this.setState({showDatePicker:false});
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

    getDrawTotal = (team) =>{
        return Math.abs(this.getVictoryTotal(team) - this.getLossesTotal(team));
    }

    getDateString = (date_start, date_end) =>{
        var date_start_conv = new Date(date_start);
        var date_end_conv = new Date(date_end);
        return date_start_conv.toLocaleDateString() + " " + date_start_conv.toLocaleTimeString() + " - " + date_end_conv.toLocaleDateString() + " " + date_end_conv.toLocaleTimeString() ;
    }

    getEvents = (date="") =>{
        getEventHistory(date).then(result => {
            console.log("GOT EVENT HISTORY:"+JSON.stringify(result));
            this.setState({obtainedEvents:result},()=>{
                if(this.state.obtainedEvents.length!=0){
                    getTeam().then(team => {
                        this.setState({userTeam:team},()=>{
                            var victoryTotal = this.getVictoryTotal(this.state.userTeam);
                            var lossTotal = this.getLossesTotal(this.state.userTeam);
                            var points = this.getPointsTotal();
                            this.setState({victories:victoryTotal,defeats:lossTotal,points:points},()=>{
                                this.setState({collectedEvents:true});
                            })
                        })
                    })
                }else{
                    this.setState({collectedEvents:true});
                }
            })
        });
    }

    getEventProps = (id) =>{
        var event = this.state.obtainedEvents.filter(event => event.id==id)[0];
        console.log("FOUND EVENT " + JSON.stringify(event));
        var points = event.performance;
        var sortedPerformance = [];
        for(var team in points){
            if(team!="user")
                sortedPerformance.push([team, points[team]]);
        }
        console.log("SORTED PERFORMANCE:"+JSON.stringify(sortedPerformance));
        sortedPerformance.sort(function(x,y){
            return x[1] - y[1];
        });
        var teamsArray = [];
        var pointsArray = [];
        
        sortedPerformance.forEach(function(team){
            teamsArray.push(team[0]);
            pointsArray.push(team[1]);
        });
        
        return [teamsArray.reverse(),pointsArray.reverse(),event.performance.user];
    }

    showEventSummary = (id) =>{
        console.log("SWITCHING TO SUMMARY WITH ID:"+id);
        var [teamsArray, pointsArray,userPoints] = this.getEventProps(id);
        console.log(teamsArray);
        console.log(pointsArray);
        this.props.navigation.navigate('event_summary',{
            eventId:id,
            teams:teamsArray,
            points:pointsArray,
            personal_team:this.state.userTeam,
            personal_score:userPoints
        })
    }

    componentDidMount(){
        this.getEvents();
    }

    render(){
        return(
            <View style={styles.main}>
                <DateTimePicker
                    isVisible={this.state.showDatePicker}
                    mode="date"
                    onConfirm={this.setDate}
                    onCancel={this.hideDatePicker}
                />
                {this.state.collectedEvents ? 
                (<View>
                <View style={styles.window_title}>
                    <Text style={styles.window_title_text}>Event History</Text>
                </View>
                <View style={styles.quit_button}>
                <TouchableOpacity>
                    <Icon
                        name={"x"}
                        type={"feather"}
                        size={30}
                        color={"#fafafa"}
                        onPress={() => {this.props.navigation.goBack()}}
                    />
                    </TouchableOpacity>
                </View>
                <View style={styles.score_summary}>
                    <Text style={styles.score_victories}>{this.state.victories} victories</Text>
                    <Text style={styles.score_defeats}>{this.state.defeats} defeat(s)</Text>
                    <Text style={styles.score_points}>{this.state.points} points</Text>
                </View>
                <View style={styles.filter}>
                    <TouchableOpacity onPress={this.showDatePicker}>
                        <Text style={styles.filter_text}>Filter by end date</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.event_board}>
                    {(this.state.obtainedEvents.length > 0) ? this.state.obtainedEvents.map((info,index) => {
                        return(<EventCard key={info.id} points_terra={info.performance.terra} points_ocean={info.performance.ocean} points_windy={info.performance.windy} points_user={info.performance.user} team_user={this.state.userTeam}
                        date={this.getDateString(info.start,info.end)} onPress={() => this.showEventSummary(info.id)}/>);
                    }) : <Text style={{fontFamily:'Ubuntu-Light',fontSize:24,color:'#fafafa'}}>We could not find any events within this time range. Go out there and take part in some!</Text>}
                </ScrollView>
                </View>) : <View><ActivityIndicator color="#6db0f6" size="large"/></View>}
            </View>
        )
    }
}

export default EventHistory;