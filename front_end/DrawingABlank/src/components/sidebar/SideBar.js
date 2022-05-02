import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {styles} from './style';
import {Icon} from 'react-native-elements';
import {logout} from '../../api/api_authentication';
import {
  deleteToken,
  deleteUsername,
  getUsername,
} from '../../api/api_networking';
import {useNavigation} from '@react-navigation/core';
import {Alert} from 'react-native';
import {Overlay} from '../../containers/Overlay';
import PlayerProfile from '../leaderboard/playerProfile';
import {getProfile, getUserWorkouts} from '../../api/api_profile';
import PushNotification from 'react-native-push-notification';
import * as Location from 'expo-location';

const TASK_NAME = 'FRESGO_GET_LOCATION';

const renderSidebar = () => {};

const renderContent = () => {};

function SideBar(props) {
  const navigation = useNavigation();
  //This is pretty bodged at the moment, but I can't seem to get this to work with the items in SideBar\

  const [profileContent, setProfileContent] = useState({});
  const [username, setUsername] = useState('');

  useEffect(() => {
    getUsername().then(result => setUsername(result));
  }, []);

  useEffect(() => {
    if (username != '') {
      getProfile(username).then(result => setProfileContent(result));
    }
  }, [username]);

  const callbackFunctions = {
    Profile: async function () {
      console.log('LOADING PROFILE');
      await getProfile(username).then(result => setProfileContent(result));
      console.log(`got the profile: ${JSON.stringify(profileContent)}`);
      props.setOverlayContent(
        <PlayerProfile
          email={'[USER.EMAIL]'}
          country={'UK'}
          username={profileContent.username}
          team={profileContent.team}
          totDist={profileContent.total_distance}
          totPoints={profileContent.total_points}
          gender={profileContent.gender}
          weight={profileContent.weight}
          dob={profileContent.dob}
          height={profileContent.height}
        />,
      );
      props.setOverlayVisible(true);
    },
    Settings: function () {
      console.log('LOADING SETTINGS');
    },
    'Saved Workouts': function () {
      console.log('GETTING WORKOUTS');
      navigation.navigate('workout_history');
    },
    'Event History': function () {
      console.log('GETTING EVENT HISTORY');
      navigation.navigate('event_history');
    },
    Leaderboards: function () {
      console.log('GETTING LEADERBOARDS');
      navigation.navigate('leaderboard');
    },
    Logout: function () {
      console.log('LOGGING OUT');
      Alert.alert(
        'Logout',
        'Are you sure you want to log out? You will lose all unsaved workouts.',
        [
          {
            text: 'Yes',
            onPress: () => {
              Location.hasStartedLocationUpdatesAsync(TASK_NAME).then(value => {
                if (value) {
                  Location.stopLocationUpdatesAsync(TASK_NAME);
                }
              });
              logout().then(_ => {
                deleteToken().then(_ => {
                  deleteUsername().then(_ => {
                    navigation.navigate('login_screen');
                  });
                });
              });
            },
          },
          {text: 'No', onPress: () => {}},
        ],
      );
    },
    'Refer a Friend!': function () {
      console.log('REFERRING A FRIEND!');
    },
  };

  // console.log('PROPS OBTAINED:' + JSON.stringify(props));

  function drawEntry({label, iconType, iconName}) {
    return (
      <TouchableOpacity onPress={callbackFunctions[label]}>
        <View style={styles.entry}>
          <Icon
            name={iconName}
            type={iconType}
            iconStyle={styles.icon}
            size={30}
            key={label}
          />
          <Text style={styles.label}>
            {label == 'Saved Workouts' ? 'Previous Workouts' : label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.sidebarContainer}>
      {/* <TouchableOpacity
        style={styles.menu_container}
        onPress={props.toggle && props.toggle()}>
        <View style={styles.menu}>
          <Icon
            name={'menu'}
            type={'feather'}
            iconStyle={styles.menuIcon}
            //containerStyle={styles.menu}
            size={30}
          />
        </View>
      </TouchableOpacity> */}

      {props.DrawItems.filter(a => !a.isFoot).map(entry => {
        return drawEntry(entry);
      })}

      <View style={styles.sidebarContainer_footer}>
        {props.DrawItems.filter(a => a.isFoot).map(entry => {
          return drawEntry(entry);
        })}
      </View>
    </View>
  );
}

export default SideBar;
