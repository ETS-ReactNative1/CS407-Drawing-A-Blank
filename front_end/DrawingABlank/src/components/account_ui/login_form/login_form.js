import React, {Component} from 'react';
import {Text, View, TextInput, Button, TouchableOpacity, Touchable} from 'react-native';
import {styles, buttons} from './style.js';

class LoginScreen extends Component{
    state = {
        email:"",
        password:""
    }

    handleEmail = (text) => {
        this.state.email = text;
    }

    handlePassword = (text) => {
        this.state.password = text;
    }

    detailsComplete = () =>{
        //Accepts unicode: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
        const rex_email = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if(!rex_email.test(this.state.email)){
            return [false, "Please enter a valid email."];
        }
        if(this.state.password == ""){
            return [false, "Please enter a password."];
        }
        return [true, ""];
    }

    processLogin = () =>{
        var verification = this.detailsComplete();
        if(!verification[0]){
            //Doing an alert for now, will change to UI later.
            alert(verification[1]);
        }
        //Continue with the login process...
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
                        placeholder="Email"
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
                    <TouchableOpacity style={buttons.loginFormButton}>
                        <Text style={buttons.buttonText} onPress={this.processLogin}>Login</Text>
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