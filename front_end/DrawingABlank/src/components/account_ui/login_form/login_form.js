import React, {Component, useCallback} from 'react';
import {Text, View, TextInput, Button, TouchableOpacity, Touchable, ActivityIndicator, Alert} from 'react-native';
import {styles, buttons} from './style.js';
import * as Authentication from '../../../api/api_authentication.js';
import { getUsername, setUsername } from '../../../api/api_networking.js';

class LoginScreen extends Component{
    state = {
        email:"",
        password:"",
        loggingIn:false,
        checkedToken:false,
    }

    handleEmail = (text) => {
        this.state.email = text;
    }

    handlePassword = (text) => {
        this.state.password = text;
    }

    detailsComplete = () =>{
        if(this.state.password == ""){
            return [false, "Please enter a password."];
        }
        return [true, ""];
    }

    verifyTokenOnStart = () =>{
        Authentication.verifyToken().then(res => {
            if(res==true){
                getUsername().then(username => {
                    if(username){
                        this.props.navigation.navigate('loading_screen',{username:username});
                    }
                });
            }
        }).then(_ => this.setState({checkedToken:true}));
    }

    processLogin = () =>{
        var verification = this.detailsComplete();
        if(!verification[0]){
            //Doing an alert for now, will change to UI later.
            Alert.alert("Login Error",verification[1]);
            return;
        }
        this.setState({loggingIn:true});
        Authentication.authenticateUser(this.state.email,this.state.password).then(_ => {
            this.props.navigation.navigate('loading_screen',{username:this.state.email});
        }).catch(err => {
            console.log("ERROR LOGGING IN:"+err);
            Alert.alert("Login Error",err.toString());
            this.setState({loggingIn:false});
        });
    }

    changeToRegister = () =>{
        //Is there a better way to do this?
        this.props.navigation.navigate('create_account_screen');
    }
    
    componentDidMount(){
        this.verifyTokenOnStart();
        this.navigationListener = this.props.navigation.addListener('blur',()=>{
            this.setState({loggingIn:false});
        })
    }
    componentWillUnmount(){
        //L + ratio + Unsubscribed
        this.navigationListener();
    }

    render(){
        return(
            <View style={styles.mainContainer}>
                {this.state.checkedToken ? <View>
                <View style={styles.titleBox}>
                    <Text style={styles.title}>Fresgo</Text>
                </View>
                <View style={styles.description}>
                    <Text style={styles.title}>Login</Text>
                    <Text style={styles.descriptionText}>Please sign in to continue.</Text>
                </View>
                <View style={styles.loginForm}>
                    <View style={styles.loginFormInputs}>
                        <TextInput style={styles.credentialsInput}
                        placeholder="Username or Email"
                        placeholderTextColor="black"
                        ref="email"
                        onChangeText={this.handleEmail}/>
                        <TextInput style={styles.credentialsInput}
                        placeholder="Password"
                        placeholderTextColor="black"
                        ref="password"
                        secureTextEntry={true}
                        textContentType="password"
                        onChangeText={this.handlePassword}/>
                    </View>
                    {!this.state.loggingIn ? 
                    <TouchableOpacity style={buttons.loginFormButton}>
                        <Text style={buttons.buttonText} onPress={this.processLogin}>Login</Text>
                    </TouchableOpacity>
                    : <ActivityIndicator style={buttons.loading} size='large' color='#6db0f6'/>}
                </View>
                <View style={styles.footer}>
                    {/* In the second text tag, an onPress function be added for switching to the signup page. */}
                    <Text style={styles.footerText}>Don't have an account? <Text style={styles.footerText} onPress={this.changeToRegister}>Sign up!</Text></Text>
                </View></View> : <ActivityIndicator/>}
            </View>
        );
    }
}

export default LoginScreen;
