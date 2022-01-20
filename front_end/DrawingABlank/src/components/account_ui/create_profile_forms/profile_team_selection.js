import React, {Component} from "react";
import {StyleSheet, Text, View, Button, TextInput,Alert, BackHandler, TouchableOpacity, Image} from "react-native";
import { styles } from "./style.js";

class ProfileTeamSelection extends Component{
    state={
        //terra, windy or ocean
        teamSelection:""
    }
    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress',function (){
            //Prevents going back
            return true;
        });
    }
    moveToDetails = () =>{
        this.props.navigation.navigate("ProfileBiography");
    }
    updateSelection = (choice) =>{
        if(choice===this.state.teamSelection)
            this.setState({teamSelection:""});
        else
            this.setState({teamSelection:choice});
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
                    <TouchableOpacity style={[styles.mascot_terra,{backgroundColor:this.state.teamSelection === "terra" ? "#ff8178" : "#edf5f3"}]} key="terra" onPress={()=>{this.updateSelection("terra")}}>
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
                    <TouchableOpacity style={[styles.mascot_ocean,{backgroundColor:this.state.teamSelection === "ocean" ? "#78e6ff" : "#edf5f3"}]} key="ocean" onPress={()=>{this.updateSelection("ocean")}}>
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
                    <TouchableOpacity style={[styles.mascot_windy,{backgroundColor:this.state.teamSelection === "windy" ? "#78ff86" : "#edf5f3"}]} key="windy" onPress={()=>{this.updateSelection("windy")}}>
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
                    <Button title="Continue" color="#6db0f6" onPress={this.MoveToDetails}/>
                </View>
            </View>
        );
    }
}

export default ProfileTeamSelection;