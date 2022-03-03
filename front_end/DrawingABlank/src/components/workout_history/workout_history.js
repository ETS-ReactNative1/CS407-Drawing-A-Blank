import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {Workout} from '../workout_recording/workout';
import {useNavigation} from '@react-navigation/native';

const WorkoutHistory = () => {
  const navigation = useNavigation();
  const recorder = new Workout();

  // setup a dummy workout
  recorder.startWorkout();
  recorder.addCoordinate(52.3764, -1.5612);
  recorder.addCoordinateDelay(52.374, -1.5536, 1);
  recorder.addCoordinateDelay(52.3726, -1.5516, 2);
  recorder.addCoordinateDelay(52.3707, -1.5501, 3);
  recorder.stopWorkout();
  const workoutTime_mins = 3;
  recorder.setWorkoutEndDate(
    new Date(recorder.getWorkoutEndDate().getTime() + workoutTime_mins * 60000),
  );

  // setup dummy workouts
  const workouts = [
    {date: '01/03/22', points: 500},
    {date: '20/02/22', points: 234},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
    {date: '01/03/22', points: 500},
  ];

  const prev_workouts = workouts.map((workout, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.buttonContainer}
        onPress={() => {
          onPress();
        }}>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={{fontSize: 20}}>{workout.date} Run</Text>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={{fontWeight: 'bold'}}>
          Total Distance {workout.points}
        </Text>
        <Text>Total Points {workout.points}</Text>
      </TouchableOpacity>
    );
  });

  const onPress = () => {
    navigation.navigate('post_workout_stats', {recorder: recorder});
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
          <Text style={styles.username}>[USERNAME]</Text>
          <Text style={styles.name}>[NAME]: workout history</Text>
          <Text style={styles.info}>Filter by date [DATEPICKER]</Text>
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
    height: '3.5%',
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
