import React, {useState} from 'react';
import {View, Text, Image} from 'react-native';
import Overlay from '../../containers/Overlay';

import {styles} from './style.js';
import EventDetails from '../events/EventDetails';

export default function PlayerProfile({
  username,
  email,
  country,
  totDist,
  totPoints,
  totGrids,
  team,
  bio,
  picture,
  gender,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={picture} style={styles.avatar} />
          <Text style={styles.name}>{username} </Text>
          <Text style={styles.userInfo}>{email} </Text>
          <Text style={styles.userInfo}>{country}</Text>
        </View>
      </View>

      <View style={styles.profileBody}>
        <View style={styles.profileItem}>
          <View style={styles.profileIconContent}>
            <Image
              style={styles.profileIcon}
              source={{
                uri: 'https://library.kissclipart.com/20181125/buq/kissclipart-statistics-art-png-clipart-business-statistics-cli-bc1bf19805ec5b58.jpg',
              }}
            />
          </View>
          <View style={styles.profileInfoContent}>
            <Text style={styles.profileInfo}>Stats</Text>
            <Text style={styles.profileSubInfo}>Total distance: {totDist}</Text>
            <Text style={styles.profileSubInfo}>Total points: {totPoints}</Text>
            <Text style={styles.profileSubInfo}>Total grids covered: {totGrids}</Text>
          </View>
        </View>

        <View style={styles.profileItem}>
          <View style={styles.profileIconContent}>
            <Image
              style={styles.profileIcon}
              source={{
                uri: 'https://img.favpng.com/5/17/19/bullseye-computer-icons-shooting-target-clip-art-png-favpng-NUU9gPtPDLnRg46qE42AgwpW3.jpg',
              }}
            />
          </View>
          <View style={styles.profileInfoContent}>
            <Text style={styles.profileInfo}>Team</Text>
            <Text style={styles.profileSubInfo}>{team}</Text>
          </View>
        </View>

        <View style={styles.profileItem}>
          <View style={styles.profileIconContent}>
            <Image
              style={styles.profileIcon}
              source={{
                uri: 'https://img.icons8.com/color/70/000000/filled-like.png',
              }}
            />
          </View>
          <View style={styles.profileInfoContent}>
            <Text style={styles.profileInfo}>Bio</Text>
            <Text style={styles.profileSubInfo}>{gender}</Text>
            <Text style={styles.profileSubInfo}>{bio}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}