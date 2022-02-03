import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, TabActions, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './login_form/login_form.js';
import CreateAccountScreen from './create_account_form/create_account_form.js';
import ProfileWelcome from './create_profile_forms/profile_welcome.js';
import ProfileAvatar from './create_profile_forms/profile_avatar.js';
import ProfileBiography from './create_profile_forms/profile_biography.js';
import ProfileTeamSelection from './create_profile_forms/profile_team_selection.js';

const Stack = createStackNavigator();

class AccountAuthUI extends Component{
    render(){
        return(
            <Stack.Navigator initialRouteName="login_screen" screenOptions={{headerShown:false}}>
                <Stack.Screen name="login_screen" component={LoginScreen}/>
                <Stack.Screen name="create_account_screen" component={CreateAccountScreen}/>
                <Stack.Screen name="ProfileWelcome" component={ProfileWelcome} options={{headerLeft:()=>null}}/>
                <Stack.Screen name="ProfileBiography" component={ProfileBiography} options={{headerLeft:()=>null}}/>
                <Stack.Screen name="ProfileAvatar" component={ProfileAvatar} options={{headerLeft:()=>null}}/>
                <Stack.Screen name="ProfileTeam" component={ProfileTeamSelection} options={{headerLeft:()=>null}}/>
            </Stack.Navigator>
        );
    }
}

export default AccountAuthUI;