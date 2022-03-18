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
      <TouchableOpacity style={styles.entry_click}>
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
