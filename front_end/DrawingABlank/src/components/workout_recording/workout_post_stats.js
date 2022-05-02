import React, {Component, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import Geolocation from 'react-native-geolocation-service';
import {Workout} from './workout';
import {styles} from './workout_style';
import WorkoutLineGraph from '../profile/personal_stats/graph/line_graph.js';
import ExtraData from '../profile/personal_stats/extra_data.js';
import {getTeam} from '../../api/api_networking';

class WorkoutPostStats extends Component {
  recorder = this.props.route.params.recorder;
  state = {
    extra_data: [],
    speed_time: this.recorder.getSpeedvsTime(),
    distance_time: this.recorder.getDistanceVsTime(),
    debug_text: '',
    submittedWorkout: !this.props.route.params.upload,
    team: '',
  };
  componentDidMount() {
    console.log('RECORDER:' + JSON.stringify(this.props.route.params.recorder));
    getTeam().then(team => {
      this.setState({team: team});
    });
    this.submitWorkout();
  }
  switchBackToMap() {
    this.props.navigation.navigate('map_view_complete');
  }
  getExtraData() {
    console.log('Recorder:', this.recorder);
    console.log('Start date:' + this.recorder.date_start);
    console.log('End Date:', this.recorder.date_end);
    var duration =
      (this.recorder.date_end.getTime() - this.recorder.date_start.getTime()) /
      1000;
    var minutes = Math.floor(duration / 60);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var seconds = duration % 60;
    seconds = seconds < 10 ? '0' + seconds.toFixed(0) : seconds.toFixed(0);
    var result = [
      {
        title: 'Average Speed',
        value: this.recorder.getAverageSpeed().toFixed(3) + 'm/s',
        key: 0,
      },
      {
        title: 'Total Distance',
        value: this.recorder.getTotalDistance().toFixed(3) + 'm',
        key: 1,
      },
      {
        title: 'Duration (mm:ss)',
        value: minutes + ':' + seconds,
        key: 4,
      },
      {
        title: 'Calories Burned',
        value: this.recorder.getCalories() + ' kcal',
        key: 5,
      },
    ];
    console.log('Returning ' + JSON.stringify(result));
    return result;
  }
  getSpeedVsTimeGraph() {
    this.state.speed_time = this.recorder.getSpeedvsTime();
    return (
      <WorkoutLineGraph
        graphTitle="Speed (m/s) vs. Time (s)"
        yData={this.state.speed_time.map(value => value.speed)}
        xFunction={(value, index) =>
          this.state.speed_time[index].time
        }
        height={250}
        team={this.state.team}
      />
    );
  }
  getDistanceVsTimeGraph() {
    this.state.distance_time = this.recorder.getDistanceVsTime();
    return (
      <WorkoutLineGraph
        graphTitle="Distance (m) vs. Time (s)"
        yData={this.state.distance_time.map(value => value.distance)}
        xFunction={(value, index) =>
          this.state.distance_time[index].time
        }
        height={250}
        team={this.state.team}
      />
    );
  }
  generateTip() {
    var quotes = [
      'After each workout, be sure to stretch your muscles in order to prevent injury.',
      'Make sure to stay hydrated and cool yourself down.',
      'A workout a day keeps the doctor away.',
      "Did you know? The world's strongest man eats over 12000 calories a day.",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
  renderExtraData() {
    this.state.extra_data = this.getExtraData();
    return <ExtraData data={this.state.extra_data} />;
  }
  submitWorkout() {
    if (this.props.route.params.upload) {
      this.recorder.uploadWorkout().then(res => {
        console.log('GOT WORKOUT RESULT:' + JSON.stringify(res));
        this.recorder.setCalories(res.calories.toFixed(2));
        this.setState({submittedWorkout: true});
      });
    }
  }
  render() {
    return (
      <ScrollView style={{paddingBottom: 40, backgroundColor: '#2179b8'}}>
        {this.state.submittedWorkout ? (
          <View
            style={{alignItems: 'center', marginTop: 20, paddingBottom: 10}}>
            <Text style={styles.workout_button_text}>Post-Workout Summary</Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Ubuntu-Light',
                color: '#fafafa',
              }}>
              Workout complete! Your results have been saved to Fresgo's
              servers.
            </Text>
            <View style={{marginTop: 20, width: '90%'}}>
              {this.getSpeedVsTimeGraph()}
              {this.getDistanceVsTimeGraph()}
              {this.renderExtraData()}
            </View>
            <TouchableOpacity style={styles.workout_button}>
              <Text
                style={styles.workout_button_text}
                onPress={() => this.switchBackToMap()}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.activity_loader}>
            <Text style={styles.loading_text}>Submitting your workout</Text>
            <ActivityIndicator size="large" color="#6db0f6" />
            <Text style={styles.quote_text}>{this.generateTip()}</Text>
          </View>
        )}
      </ScrollView>
    );
  }
}

export default WorkoutPostStats;
