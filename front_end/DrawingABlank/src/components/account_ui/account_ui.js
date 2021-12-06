import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, TabActions, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './login_form/login_form.js';
import CreateAccountScreen from './create_account_form/create_account_form.js';

const Stack = createStackNavigator();

class AccountAuthUI extends Component{
    render(){
        return(
            <Stack.Navigator initialRouteName="login_screen" screenOptions={{headerShown:false}}>
                <Stack.Screen name="login_screen" component={LoginScreen}/>
                <Stack.Screen name="create_account_screen" component={CreateAccountScreen}/>
            </Stack.Navigator>
        );
    }
}

export default AccountAuthUI;