/**
 * For the moment, until we implement navigation, I'd say just let App.js just act as a place to test your UIs.
 */
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AccountAuthUI from './src/components/account_ui/account_ui.js';
import LoginScreen from './src/components/account_ui/login_form/login_form.js';

export default function App() {
  return(
    //<CreateAccountScreen></CreateAccountScreen>
    <NavigationContainer>
      <AccountAuthUI></AccountAuthUI>
    </NavigationContainer>
  );
}