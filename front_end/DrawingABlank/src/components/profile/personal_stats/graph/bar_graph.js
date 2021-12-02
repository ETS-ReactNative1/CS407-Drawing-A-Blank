import React, {Component} from 'react';
import { Grid, BarChart, XAxis, YAxis } from 'react-native-svg-charts'
import {View,Text} from 'react-native';
import {Text as SVGText} from 'react-native-svg';
import {styles} from './style.js';
import * as scale from 'd3-scale'

/*Samples taken from: https://github.com/JesperLekland/react-native-svg-charts-examples#bar */

class WorkoutBarGraph extends Component{
    render(){
        const axesSvg = { fontSize: 12, fill: 'grey' };
        const xAxisHeight = 30;
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <SVGText
                    key={ index }
                    x={ x(index) + (bandwidth / 2) }
                    y={ y(value)+10 }
                    fontSize={ 14 }
                    fill={ 'black' }
                    alignmentBaseline={ 'middle' }
                    textAnchor={ 'middle' }
                >
                    {value}
                </SVGText>
            ))
        )
        return(
            <View>
                <Text style={styles.title}>{this.props.graphTitle}</Text>
                <View style={{ height: this.props.height, padding: 20, marginBottom:10, flexDirection:'row' }}>
                        <View style={{ flex: 1 }}>
                            <BarChart
                                style={{ flex: 1,borderLeftColor:'gray',borderLeftWidth:0.5 }}
                                data={this.props.data}
                                svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                                contentInset={{ top: 10, bottom: 10 }}
                                spacing={0.2}
                                gridMin={0}
                            >
                            <Grid direction={Grid.Direction.HORIZONTAL}/>
                            <Labels/>
                            <XAxis
                                data={ this.props.data }
                                scale={scale.scaleBand}
                                formatLabel={ this.props.xFunction }
                                labelStyle={ { color: 'black' } }
                                svg={axesSvg}
                                style={{marginTop:this.props.height - xAxisHeight - 10, height: xAxisHeight}}
                            />
                            </BarChart>
                        </View>
                </View>
            </View>
        )
    }
}
export default WorkoutBarGraph;