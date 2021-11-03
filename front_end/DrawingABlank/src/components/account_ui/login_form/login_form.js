import React, {Component} from 'react';
import {Text, View, TextInput, Button, TouchableOpacity, Touchable} from 'react-native';
import {styles, buttons} from './style.js';

class LoginScreen extends Component{
    state = {
        username:"",
        password:""
    }
    
    render(){
        return(
            <View style={styles.mainContainer}>
                <View style={styles.titleBox}>
                    <Text style={styles.title}>Drawing A Blank</Text>
                </View>
                <View style={styles.description}>
                    <Text style={styles.title}>Login</Text>
                    <Text style={styles.descriptionText}>Please sign in to continue.</Text>
                </View>
                <View style={styles.loginForm}>
                    <View style={styles.loginFormInputs}>
                        <TextInput style={styles.credentialsInput}
                        placeholder="Username"
                        placeholderTextColor="black"
                        ref="username"
                        textContentType="username"/>
                        <TextInput style={styles.credentialsInput}
                        placeholder="Password"
                        placeholderTextColor="black"
                        ref="password"
                        secureTextEntry={true}
                        textContentType="password"/>
                    </View>
                    <TouchableOpacity style={buttons.loginFormButton}>
                        <Text style={buttons.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footer}>
                    {/* In the second text tag, an onPress function be added for switching to the signup page. */}
                    <Text style={styles.footerText}>Don't have an account? <Text style={styles.footerText}>Sign up!</Text></Text>
                </View>
            </View>
        );
    }
}

export default LoginScreen;