import React, {useEffect, useState} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';

import {styles} from './style.js';
import {updateProfileQuick} from '../../api/api_profile';
import DatePicker from 'react-native-date-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';

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
  weight,
  dob,
  height,
}) {
  const [pic, setPic] = useState(require('../../assets/img/ocean.png'));

  const [editing, setEditing] = useState(false);

  const [edits, setEdits] = useState({
    user: username,
    weight: weight,
    gender: gender,
    date_of_birth: dob,
    height: height,
  });

  //date picker states
  const [date, setDate] = useState(new Date(dob));
  const [open, setOpen] = useState(false);

  const handleChange = (caller, e) => {
    const oldEdits = Object.assign({}, edits);
    if (caller === 'gender') {
      oldEdits.gender = e;
    } else if (caller === 'weight') {
      oldEdits.weight = e;
    } else if (caller === 'height') {
      oldEdits.height = e;
    } else if (caller === 'DOB') {
      // YYYY-MM-DD
      //Actually needs to be D/M/Y
      console.log(date.toISOString().slice(0, 10));
      oldEdits.date_of_birth = date.toISOString().slice(0, 10);
    }
    setEdits(oldEdits);
  };

  const default_pictures = {
    terra: require('../../assets/img/terra.png'),
    windy: require('../../assets/img/windy.png'),
  };

  const dateOnConfirm = (date) => {
    setDate(date);
    setOpen(false);
  }

  const dateOnCancel = () => {
    setOpen(false);
  }

  useEffect(() => {
    if (team.toLowerCase() === 'terra') {
      setPic(default_pictures.terra);
    } else if (team.toLowerCase() === 'windy') {
      setPic(default_pictures.windy);
    }
  }, [default_pictures.terra, default_pictures.windy, team, username]);

  useEffect(() => {
    handleChange('DOB',date);
  },[date])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {editing ? (
            <TouchableOpacity
              style={styles.editor}
              onPress={() => {
                updateProfileQuick(edits)
                  .then(result => {
                    alert('Profile updated!');
                    setEditing(false);
                  })
                  .catch(err => alert(err));
              }}>
              <Text style={{color: '#ff0000', fontSize: 20}}>SAVE</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.editor}
              onPress={() => setEditing(true)}>
              <Text style={{color: '#ff0000', fontSize: 20}}>EDIT</Text>
            </TouchableOpacity>
          )}
          <Image source={pic} style={styles.avatar} />
          <Text style={styles.name}>{username} </Text>
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
            <Text style={styles.profileSubInfo}>Total distance: {totDist.toFixed(1)}</Text>
            <Text style={styles.profileSubInfo}>Total points: {totPoints}</Text>
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
            {editing ? (
              <View>
                <DateTimePicker
                  isVisible={open}
                  mode="date"
                  onConfirm={dateOnConfirm}
                  onCancel={dateOnCancel}
                  date={new Date(edits.date_of_birth)}
                />
                <TextInput
                  style={styles.profileSubInfoEditing}
                  onChangeText={genderN => handleChange('gender', genderN)}
                  placeholder={`Gender: ${gender}`}
                />
                <TextInput
                  style={styles.profileSubInfoEditing}
                  onChangeText={weightN => handleChange('weight', weightN)}
                  placeholder={`Weight: ${weight}kg`}
                />
                <TextInput
                  style={styles.profileSubInfoEditing}
                  onChangeText={heightN => handleChange('height', heightN)}
                  placeholder={`Height: ${height}m`}
                />
                <TouchableOpacity onPress={() => setOpen(true)}>
                  <TextInput
                    editable={false}
                    selectTextOnFocus={false}
                    style={styles.profileSubInfoEditing}
                    placeholder={`DOB: ${edits.date_of_birth}`}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.profileSubInfo}>
                  Gender: {edits.gender}
                </Text>
                <Text style={styles.profileSubInfo}>
                  Weight: {edits.weight}kg
                </Text>
                <Text style={styles.profileSubInfo}>
                  Height: {edits.height}m
                </Text>
                <Text style={styles.profileSubInfo}>
                  DOB: {edits.date_of_birth}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
