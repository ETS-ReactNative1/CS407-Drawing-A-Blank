import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {styles} from './style.js';

class ExtraData extends Component{
    render(){
        return(
            <View style={styles.extraData}>
                <View style={styles.singleData}>
                    <View style={styles.singleDataTitle}>
                        <Text style={styles.singleDataText}>Average Distance</Text>
                    </View>
                    <View style={styles.singleDataValue}>
                        <Text style={styles.singleDataText}>0.3m</Text>
                    </View>
                </View>
            </View>
        )
    }
}

export default ExtraData;