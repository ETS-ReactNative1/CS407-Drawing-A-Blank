import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {styles} from './style';
import {Icon} from 'react-native-elements';
import { logout } from '../../api/api_authentication';
import { deleteToken, deleteUsername } from '../../api/api_networking';
import { useNavigation } from '@react-navigation/core';
import { Alert } from 'react-native';

const renderSidebar = () => {};

const renderContent = () => {};


function SideBar(props) {
  const navigation = useNavigation();
  //This is pretty bodged at the moment, but I can't seem to get this to work with the items in SideBar
  const callbackFunctions = {
    "Profile":function(){
      console.log("LOADING PROFILE");
    },
    "Settings":function(){
      console.log("LOADING SETTINGS");
    },
    "Saved Workouts":function(){
      console.log("GETTING WORKOUTS");
    },
    "Logout":function(){
      console.log("LOGGING OUT");
      Alert.alert('Logout','Are you sure you want to log out? You will lose all unsaved workouts.',
        [
            {text:'Yes',onPress:()=>{
              logout().then(_ => {
                deleteToken().then(_ => {
                  deleteUsername().then(_ => {
                    navigation.navigate("login_screen");
                  })
                })
              })
            }},
            {text:'No',onPress:()=>{}}
        ])
    },
    "Refer a Friend!":function(){
      console.log("REFERRING A FRIEND!");
    }
  };

  console.log("PROPS OBTAINED:"+JSON.stringify(props));

  function drawEntry({label, iconType, iconName}) {
    return (
      <TouchableOpacity onPress={callbackFunctions[label]}>
        <View style={styles.entry}>
          <Icon
            name={iconName}
            type={iconType}
            iconStyle={styles.icon}
            size={30}
          />
          <Text style={styles.label}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.sidebarContainer}>
      {props.DrawItems.map(entry => {
        return drawEntry(entry);
      })}
    </View>
  );
}

export default SideBar;
