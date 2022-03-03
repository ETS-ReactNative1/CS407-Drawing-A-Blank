import React, {Component} from 'react';
import {ScrollView, Text, View} from 'react-native';
import WorkoutLineGraph from './graph/line_graph.js';
import ExtraData from './extra_data.js';
import {styles} from './style.js';
import WorkoutBarGraph from './graph/bar_graph.js';

class PersonalWorkoutStats extends Component {
  render() {
    const data_graph = [
      50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80,
    ];
    const extra_data = [
      {title: 'Minimum Speed', value: '3mph'},
      {title: 'Maximum Speed', value: '82mph'},
      {title: 'Average Speed', value: '43.5mph'},
      {title: 'Distance Covered', value: '23.4km'},
    ];
    const data_bar = [14, 80, 100, 55];
    return (
      <ScrollView style={styles.main}>
        <WorkoutLineGraph
          graphTitle="Speed vs. Time"
          yData={data_graph}
          xFunction={(value, index) => value}
          height={250}
        />
        <ExtraData data={extra_data} />
        <View
          style={{
            paddingTop: 20,
            borderTopColor: 'grey',
            borderTopWidth: 1,
          }}
        />
        <WorkoutBarGraph
          data={data_bar}
          height={250}
          xFunction={(value, index) => (index + 1).toString() + 'th Jan.'}
          graphTitle="Steps per day"
        />
        <ExtraData data={extra_data} />
        <View style={{padding: 20}} />
      </ScrollView>
    );
  }
}
export default PersonalWorkoutStats;
