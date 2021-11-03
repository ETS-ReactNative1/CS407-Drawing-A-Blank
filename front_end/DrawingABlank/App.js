/**
 * For the moment, until we implement navigation, I'd say just let App.js just act as a place to test your UIs.
 */
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LoginScreen from './src/components/account_ui/login_form/login_form.js'

export default function App() {
  return(
    <LoginScreen></LoginScreen>
  );
}