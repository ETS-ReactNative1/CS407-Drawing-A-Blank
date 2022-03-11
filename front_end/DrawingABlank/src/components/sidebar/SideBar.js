import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {styles} from './style';
import {Icon} from 'react-native-elements';

const renderSidebar = () => {};

const renderContent = () => {};

function SideBar(props) {
  console.log('prosp', Icon);

  function drawEntry({label, iconType, iconName}) {
    return (
      <TouchableOpacity>
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
