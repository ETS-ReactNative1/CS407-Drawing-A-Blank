import React, {Component} from "react";
import {StyleSheet, Text, View, Button, TextInput,Alert, BackHandler, TouchableOpacity, Image} from "react-native";
import { styles } from "./style.js";
import { createUser } from '../../../api/api_authentication.js';
import { setToken, setUsername } from "../../../api/api_networking.js";

class ProfileTeamSelection extends Component{
    state={
        //terra, windy or ocean
        username:this.props.route.params.username,
        password:this.props.route.params.password,
        email:this.props.route.params.email,
        teamSelection:""
    }
    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress',function (){
            //Prevents going back
            return true;
        });
    }
    moveToDetails = () =>{
        this.props.navigation.navigate("ProfileBiography",this.state);
    }

    detailsComplete = () =>{
        if(this.state.teamSelection == ""){
            return [false, "Please select a team."];
        }
        return [true, ""];
    }

    updateSelection = (choice) =>{
        if(choice===this.state.teamSelection)
            this.setState({teamSelection:""});
        else
            this.setState({teamSelection:choice});
    }
    createAccount = (username,password,email,team) =>{
        var verification = this.detailsComplete();
        if(verification[0]){
            createUser(username,email,password,team).then(_ => {
                this.setUsername(username);
                this.setToken(token)
                this.moveToDetails();
            }).catch(err => { 
                console.log("ERROR:"+err)
                Alert.alert("Error","We were unable to create your account, this may mean your username or email has already been used. Please try again.");
                this.props.navigation.navigate("login_screen");
            });
        }else{
            alert(verification[1]);
        }
    }
    completeAccountCreation = () =>{
        this.createAccount(this.state.username,this.state.password,this.state.email,this.state.teamSelection);
    }
    render(){
        return(
            <View style={styles.main}>
                <View style={styles.welcome_title}>
                    <Text style={styles.title_text}>Team Selection</Text>
                </View>
                <View style={styles.body_explanation}>
                    <Text style={styles.body_text}>What sort of colourful path will you be taking?</Text>
                </View>
                <View style={{width:"90%", paddingBottom:20}}>
                    <Text style={styles.form_input_title}>Select one of three teams to join. YOU CAN ONLY DO THIS ONCE PER SEASON. You will compete in collaboration with whoever else is in your team.</Text>
                </View>
                <View style={styles.mascots}>
                    {/* Would maybe make more sense to put this in a component, but for the moment, it's fine */}
                    <TouchableOpacity style={[styles.mascot_terra,{backgroundColor:this.state.teamSelection === "terra" ? "#ff8178" : "#57aae6"}]} key="terra" onPress={()=>{this.updateSelection("terra")}}>
                        <View style={styles.mascot_container}>
                            <View style={styles.mascot_information}>
                                <View style={styles.mascot_title}>
                                    <Text style={styles.mascot_title_text}>Terra</Text>
                                </View>
                                <View style={styles.mascot_description}>
                                    <Text style={styles.mascot_info_text}>March along with this fiery red panda and cover your foes' path in flames!</Text>
                                </View>
                            </View>
                            <View style={styles.mascot_image}>
                                <Image
                                style={{height:64,width:64, resizeMode:"contain"}}
                                source={require('../../../assets/img/terra.png')}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.mascots}>
                    <TouchableOpacity style={[styles.mascot_ocean,{backgroundColor:this.state.teamSelection === "ocean" ? "#78e6ff" : "#57aae6"}]} key="ocean" onPress={()=>{this.updateSelection("ocean")}}>
                        <View style={styles.mascot_container}>
                            <View style={styles.mascot_information}>
                                <View style={styles.mascot_title}>
                                    <Text style={styles.mascot_title_text}>Océan</Text>
                                </View>
                                <View style={styles.mascot_description}>
                                    <Text style={styles.mascot_info_text}>Swim across the vast sea with this French rascal and flood your opponents!</Text>
                                </View>
                            </View>
                            <View style={styles.mascot_image}>
                                <Image
                                style={{height:64,width:64, resizeMode:"contain"}}
                                source={require('../../../assets/img/ocean.png')}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.mascots}>
                    <TouchableOpacity style={[styles.mascot_windy,{backgroundColor:this.state.teamSelection === "windy" ? "#78ff86" : "#57aae6"}]} key="windy" onPress={()=>{this.updateSelection("windy")}}>
                        <View style={styles.mascot_container}>
                            <View style={styles.mascot_information}>
                                <View style={styles.mascot_title}>
                                    <Text style={styles.mascot_title_text}>Windy</Text>
                                </View>
                                <View style={styles.mascot_description}>
                                    <Text style={styles.mascot_info_text}>Sail across the vast skies and blow enemies out of the way of victory!</Text>
                                </View>
                            </View>
                            <View style={styles.mascot_image}>
                                <Image
                                style={{height:64,width:64, resizeMode:"contain"}}
                                source={require('../../../assets/img/windy.png')}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.continue_button}>
                    <Button title="Continue" color="#6db0f6" onPress={this.completeAccountCreation}/>
                </View>
            </View>
        );
    }
}

export default ProfileTeamSelection;