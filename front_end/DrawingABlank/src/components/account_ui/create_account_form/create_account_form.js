import React, {Component} from 'react';
import {Text, View, TextInput, Button, TouchableOpacity, Touchable} from 'react-native';
import {styles, buttons} from './style.js';

class CreateAccountScreen extends Component{
    state = {
        email:"",
        password:"",
        password_confirm:"",
        team_name:""
    }

    handleEmail = (text) => {
        this.state.email = text;
    }

    handlePassword = (text) => {
        this.state.password = text;
    }

    handleConfirmPassword = (text) => {
        this.state.password_confirm = text;
    }

    handleTeamName = (text) => {
        this.state.team_name = text;
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
        if(this.state.password != this.state.password_confirm){
            return [false, "Your passwords do not match, please try again."];
        }
        if(this.state.team_name == ""){
            return [false, "Please enter a team name."];
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
                    <Text style={styles.title}>Create an account</Text>
                    <Text style={styles.descriptionText}>Sign up and begin your journey today!</Text>
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
                        <TextInput style={styles.credentialsInput}
                        placeholder="Confirm Password"
                        placeholderTextColor="black"
                        ref="password"
                        secureTextEntry={true}
                        textContentType="password"
                        onChangeText={this.handleConfirmPassword}/>
                        <TextInput style={styles.credentialsInput}
                        placeholder="Team Name"
                        placeholderTextColor="black"
                        ref="username"
                        onChangeText={this.handleTeamName}/>
                    </View>
                    <TouchableOpacity style={buttons.loginFormButton}>
                        <Text style={buttons.buttonText} onPress={this.processLogin}>Register</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.footer}>
                    {/* In the second text tag, an onPress function be added for switching to the signup page. */}
                    <Text style={styles.footerText}>Already have an account? <Text style={styles.footerText}>Sign in!</Text></Text>
                </View>
            </View>
        );
    }
}

export default CreateAccountScreen;