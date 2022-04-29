import React, {Component} from "react";
import {useState} from "react";
import {StyleSheet, Text, View, Button, TextInput,Alert,BackHandler} from "react-native";
import DatePicker from "react-native-date-picker";
import { readDirectoryAsync } from "expo-file-system";
import {withNavigation} from "react-navigation";
import { styles } from "./style";
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView } from "react-native-gesture-handler";
import { updateProfile } from "../../../api/api_profile";

class ProfileBiography extends Component{
    state={
        name:"",
        dateofbirth:new Date(),
        gender:"",
        height:"",
        weight:"",
        bio:"",
        open:false,
        avatar:"",
        teamselection:this.props.route.params.teamSelection
    }
    genders = [{label:'Male',value:'M'},{label:'Female',value:'F'},{label:'Non-binary',value:'NB'},{label:'Prefer not to disclose',value:'X'}]

    nextScreen = () =>{
        this.props.navigation.navigate('ProfileAvatar',this.state);
    }

    setOpen = (open) =>{
        this.setState({
          open:open
        });
    }

    setValue = (callback) =>{
        this.setState(state => ({
            gender:callback(state.value)
        }));
    }

    detailsComplete = () =>{
        if(this.state.name==""){
            return [false, "Please enter your name."];
        }
        if(this.state.gender==""){
            return [false, "Please enter your gender."];
        }
        if(this.state.height==""){
            return [false, "Please enter your height."];
        }
        if(this.state.weight==""){
            return [false, "Please enter your weight."];
        }
        return [true, ""];
    }

    goToMap = () =>{
        //this.props.navigation.navigate('loading_screen',{username:this.state.name});
        Alert.alert('Tutorial','Would you like to proceed to the tutorial? (Recommended for first time users)',
        [
            {text:'Yes',onPress:()=>this.props.navigation.navigate('tutorial')},
            {text:'No',onPress:()=>this.props.navigation.navigate('loading_screen',{username:this.state.name})}
        ])
    }

    createProfile = (profile_name,date_of_birth,gender,height,weight) => {
        var first_name = profile_name.split(' ')[0];
        var last_name = (profile_name.split(' ').length > 1) ? profile_name.split(' ')[1] : "";
        //Code taken from: https://stackoverflow.com/questions/3605214/javascript-add-leading-zeroes-to-date
        var full_date_string = ('0' + date_of_birth.getDate()).slice(-2) + '/'
        + ('0' + (date_of_birth.getMonth()+1)).slice(-2) + '/'
        + date_of_birth.getFullYear();
        //Check what token is required here
        updateProfile(first_name,last_name,full_date_string,gender,height,weight).then(_=>{
            this.goToMap();
        }).catch(err => alert(err));
    }

    completeRegistration = () => {
        this.createProfile(this.state.name, this.state.dateofbirth, this.state.gender, this.state.height, this.state.weight);
    }

    componentDidMount(){
        BackHandler.addEventListener('hardwareBackPress',function (){
            //Prevents going back
            return true;
        });
        console.log(this.props.route.params);
    }
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.main}>
                <View style={styles.welcome_title}>
                    <Text style={styles.title_text}>Basic Details</Text>
                </View>
                <View style={styles.body_explanation}>
                    <Text style={styles.body_text}>"So, tell me a bit about yourself."</Text>
                </View>
                <View style={styles.form_inputs}>
                    <TextInput placeholderTextColor='#fafafa' style={styles.form_input} placeholder="Name" ref="name" onChangeText={(text)=>this.setState({name:text})}/>
                </View>
                <View style={styles.form_inputs}>
                    <View style={styles.form_input_title}>
                        <Text style={{color:'#fafafa'}}>Date Of Birth</Text>
                    </View>
                    <View>
                        <DatePicker textColor="#fafafa" date={this.state.dateofbirth} onDateChange={(date)=>this.setState({dateofbirth:date})} mode="date" style={{height:50,width:350}}/>
                    </View>
                </View>
                <View style={styles.form_inputs}>
                    <DropDownPicker
                        items={this.genders}
                        value={this.state.gender}
                        placeholder="Gender"
                        open={this.state.open}
                        setOpen={this.setOpen}
                        setValue={this.setValue}
                        style={styles.form_input}
                        dropDownContainerStyle={styles.form_input}
                        textStyle={{color:"#fafafa"}}
                    />
                </View>
                <View style={styles.form_inputs}>
                    <TextInput style={styles.form_input} placeholderTextColor='#fafafa' keyboardType="number-pad" placeholder="Height (m)" ref="height" value={this.state.height} onChangeText={(text)=>this.setState({height:text})}/>
                </View>
                <View style={styles.form_inputs}>
                    <TextInput style={styles.form_input} placeholderTextColor='#fafafa' keyboardType="number-pad" placeholder="Weight (kg)" ref="weight" value={this.state.weight} onChangeText={(text)=>this.setState({weight:text})}/>
                </View>
                
                <View style={styles.form_inputs}>
                    <TextInput style={styles.form_input}
                            placeholder="Bio (Optional)"
                            ref="bioinput"
                            multiline
                            numberOfLines={5}
                            maxLength={400}
                            textAlignVertical="top"
                            placeholderTextColor='#fafafa'
                            onChangeText={(text)=>{this.counter=text.length;this.setState({bio:text})}}
                    />
                </View>
                <View style={styles.character_counter}>
                    <Text style={styles.chartext} ref="charcounter">
                        {this.counter ? this.counter : 0}/400 characters used. 
                    </Text>
                </View>
                
                <View style={styles.continue_button}>
                    <Button title="Continue" color="#6db0f6" onPress={this.completeRegistration}/>
                </View>
            </View>
        );
    }
}

export default ProfileBiography;