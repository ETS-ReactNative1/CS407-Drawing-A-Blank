import React, {Component} from 'react';
import {Text, View, TextInput, Button, TouchableOpacity, Touchable, ActivityIndicator} from 'react-native';
import {styles} from './style.js';

class LoadingScreen extends Component{
    state={
        loading_text:"Retrieving map info"
    }
    componentDidMount(){
        //Perform requests here
    }
    render(){
        return(
            <View style={styles.mainContainer}>
                <View style={styles.loading_box}>
                    <Text style={styles.loading_text_title}>Welcome {this.props.username}</Text>
                    <View style={styles.loading_icon}>
                        <ActivityIndicator color='#6db0f6' size='large'/>
                    </View>
                    <Text style={styles.loading_text_description}>{this.state.loading_text}</Text>
                </View>
            </View>
        );
    }
}

export default LoadingScreen;