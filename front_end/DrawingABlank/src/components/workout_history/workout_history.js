import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import {Workout} from '../workout_recording/workout';
import {useNavigation} from '@react-navigation/native';
import {getUserWorkout, getUserWorkouts} from '../../api/api_profile';
import {authenticateUser} from '../../api/api_authentication';
import {getUsername} from '../../api/api_networking';
import DatePicker from 'react-native-date-picker';

const WorkoutHistory = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [workout, setWorkout] = useState([]);

  //date picker states
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const handleChange = e => {
    console.log('fd');
  };

  useEffect(() => {
    getUserWorkouts().then(result => setWorkouts(result));
    getUsername().then(result => setUsername(result));
  }, []);

  const filtered_workouts = workouts.filter(workout => {
    return new Date(workout.date).getTime() <= date.getTime();
  });

  useEffect(() => {
    // setup a recorder for the current selected workout
    if (workout.length > 0) {
      const recorder = new Workout();
      recorder.recording = true;
      recorder.setWorkoutStartDate(workout[0].time);
      workout.forEach(point => {
        recorder.addCoordinateAtTime(
          point.latitude,
          point.longitude,
          point.time,
        );
      });
      recorder.setWorkoutEndDate(workout[workout.length - 1].time);
      recorder.recording = false;
      console.log(recorder.toJSON());
      navigation.navigate('post_workout_stats', {
        recorder: recorder,
        upload: false,
      });
    }
  }, [workout]);

  const prev_workouts = workouts.map((workout, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.buttonContainer}
        onPress={() => {
          onPress(workout.id);
        }}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={{fontSize: 20}}>
          {workout.date.substring(0, 10)} {workout.type}
        </Text>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={{fontWeight: 'bold'}}>
          Total Distance {workout.points}
        </Text>
        <Text>Total Points {workout.points}</Text>
      </TouchableOpacity>
    );
  });
  const onPress = async id => {
    await getUserWorkout(id).then(result => {
      console.log('OBTAINED RESULT:' + JSON.stringify(result));
      setWorkout(result);
    });

    // setup a recorder for the current selected workout
    /*
    const recorder = new Workout();
    recorder.recording = true;
    recorder.setWorkoutStartDate(workout[0].time);
    workout.forEach(point => {
      recorder.addCoordinateAtTime(point.latitude, point.longitude, point.time);
    });
    recorder.setWorkoutEndDate(workout[workout.length - 1].time);
    recorder.recording = false;
    console.log(recorder.toJSON());
    navigation.navigate('post_workout_stats', {recorder: recorder});
    */
  };

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <Image
        style={styles.avatar}
        source={require('../../assets/img/ocean.png')}
      />

      <ScrollView style={styles.body}>
        <View style={styles.bodyContent}>
          <DatePicker
            modal
            open={open}
            textColor="#000000"
            date={new Date(date)}
            onDateChange={DOBN => handleChange('DOB', DOBN)}
            mode="date"
            onConfirm={date => {
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          <Text style={styles.name}>{username}: workout history</Text>
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text style={styles.info}>
              Filter by date: {date.toDateString()}
            </Text>
          </TouchableOpacity>
          <Text style={styles.description}>
            Take a look back at some of your previous workouts!
          </Text>
          {prev_workouts}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  title: {
    paddingLeft: 10,
    fontSize: 50,
  },
  header: {
    height: 115,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 20,
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: '#696969',
    fontWeight: '600',
  },
  info: {
    fontSize: 16,
    color: '#00BFFF',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#696969',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    height: 100,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: 300,
    borderRadius: 10,
    backgroundColor: '#78daf6',
    paddingLeft: 20,
    paddingTop: 7,
  },
});
export default WorkoutHistory;
