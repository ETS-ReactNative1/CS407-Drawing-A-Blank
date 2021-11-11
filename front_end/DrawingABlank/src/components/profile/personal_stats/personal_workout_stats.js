import React, {Component} from 'react';
import {Text, View} from 'react-native';
import WorkoutLineGraph from './graph/line_graph.js';
import ExtraData from './extra_data.js';
import { styles } from './style.js';

class PersonalWorkoutStats extends Component{
    render(){
        const data_graph = [ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]
        const extra_data = [{title:"Minimum Speed",value:"3mph"},{title:"Maximum Speed",value:"82mph"},{title:"Average Speed",value:"43.5mph"},{title:"Distance Covered",value:"23.4km"}]
        return(
            <View style={styles.main}>
                <WorkoutLineGraph graphTitle="Speed vs. Time"
                                    yData={data_graph}/>
                <ExtraData data={extra_data}/>
            </View>
        )
    }
}
export default PersonalWorkoutStats;