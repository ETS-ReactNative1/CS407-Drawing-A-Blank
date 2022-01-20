import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, TabActions, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileWelcome from './profile_welcome.js';
import ProfileBiography from './profile_biography.js';
import ProfileAvatar from './profile_avatar.js';
import ProfileTeamSelection from './profile_team_selection.js';

const Stack = createStackNavigator();
class ProfileCreationNavigator extends Component{
    render(){
        return (
            //I have doubts whether this is the best way to do navigation at the moment, anyone else know if there are better methods?
            <Stack.Navigator initialRouteName="ProfileTeam" screenOptions={{headerShown:false}}>
                <Stack.Screen name="ProfileWelcome" component={ProfileWelcome} options={{headerLeft:()=>null}}/>
                <Stack.Screen name="ProfileBiography" component={ProfileBiography} options={{headerLeft:()=>null}}/>
                <Stack.Screen name="ProfileAvatar" component={ProfileAvatar} options={{headerLeft:()=>null}}/>
                <Stack.Screen name="ProfileTeam" component={ProfileTeamSelection} options={{headerLeft:()=>null}}/>
            </Stack.Navigator>
        );
    }
}

export default ProfileCreationNavigator;