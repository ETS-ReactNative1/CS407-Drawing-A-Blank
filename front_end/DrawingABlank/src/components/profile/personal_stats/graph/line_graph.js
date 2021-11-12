import React, {Component} from 'react';
import { Grid, LineChart, XAxis, YAxis } from 'react-native-svg-charts'
import {Text, View} from 'react-native';
import {styles} from './style.js';

class WorkoutLineGraph extends Component{
    render(){
        const axesSvg = { fontSize: 12, fill: 'grey' };
        const verticalContentInset = { top: 10, bottom: 10 }
        const xAxisHeight = 30
        return(
            <View>
                <Text style={styles.title}>{this.props.graphTitle}</Text>
                <View style={{ height: this.props.height, padding: 0, flexDirection: 'row' }}>
                    <YAxis
                        data={this.props.yData}
                        style={{ marginBottom: xAxisHeight }}
                        contentInset={verticalContentInset}
                        svg={axesSvg}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <LineChart
                            style={{ flex: 1 }}
                            data={this.props.yData}
                            contentInset={verticalContentInset}
                            svg={{ stroke: 'rgb(134, 65, 244)' }}
                        >
                            <Grid/>
                        </LineChart>
                        <XAxis
                            style={{ marginHorizontal: -10, height: xAxisHeight }}
                            data={this.props.yData}
                            formatLabel={this.props.xFunction}
                            contentInset={{ left: 10, right: 10 }}
                            svg={axesSvg}
                        />
                    </View>
                </View>
            </View>
        )
    }
}
export default WorkoutLineGraph;