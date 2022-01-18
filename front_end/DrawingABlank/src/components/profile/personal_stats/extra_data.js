import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {styles} from './style.js';

class ExtraData extends Component{
    render(){
        return(
            <View style={styles.extraData}>
                {this.props.data.map(dataInfo => (
                    <View style={styles.singleData} key={dataInfo.key}>
                        <View style={styles.singleDataTitle}>
                            <Text style={styles.singleDataText}>{dataInfo.title}</Text>
                        </View>
                        <View style={styles.singleDataValue}>
                            <Text style={styles.singleDataText}>{dataInfo.value}</Text>
                        </View>
                    </View>
                ))}
            </View>
        )
    }
}

export default ExtraData;