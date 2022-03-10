import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, TabActions, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MapTutorial from './MapTutorial';
import WorkoutTutorial from './WorkoutTutorial';
import EventTutorial from './EventTutorial';
import LeaderboardTutorial from './LeaderboardTutorial';
import TutorialLocation from './TutorialLocation';

const Stack = createStackNavigator();

class TutorialNavigation extends Component{
    render(){
        return(
            <Stack.Navigator initialRouteName="map_tutorial" screenOptions={{headerShown:false}}>
                <Stack.Screen name="map_tutorial" component={MapTutorial}/>
                <Stack.Screen name="workout_tutorial" component={WorkoutTutorial}/>
                <Stack.Screen name="event_tutorial" component={EventTutorial}/>
                <Stack.Screen name="leaderboard_tutorial" component={LeaderboardTutorial}/>
                <Stack.Screen name="tutorial_location" component={TutorialLocation}/>
            </Stack.Navigator>
        );
    }
}

export default TutorialNavigation;