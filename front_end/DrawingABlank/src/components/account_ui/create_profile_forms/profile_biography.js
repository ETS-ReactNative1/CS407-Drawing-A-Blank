import React, {Component} from "react";
import {useState} from "react";
import {StyleSheet, Text, View, Button, TextInput,Alert} from "react-native";
import DatePicker from "react-native-date-picker";
import { readDirectoryAsync } from "expo-file-system";
import {withNavigation} from "react-navigation";
import { styles } from "./style";
import DropDownPicker from "react-native-dropdown-picker";

class ProfileBiography extends Component{
    state={
        name:"",
        dateofbirth:new Date(),
        gender:"",
        height:"",
        weight:"",
        bio:"",
        open:false
    }
    genders = [{label:'Male',value:'M'},{label:'Female',value:'F'},{label:'Non-binary',value:'NB'},{label:'Prefer not to disclose',value:'X'}]

    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.main}>
                <View style={styles.welcome_title}>
                    <Text style={styles.title_text}>Biography</Text>
                </View>
                <View style={styles.body_explanation}>
                    <Text style={styles.body_text}>"So, tell me a bit about yourself."</Text>
                </View>
                <View style={styles.form_inputs}>
                    <TextInput style={styles.form_input} placeholder="Name" ref="name" onChangeText={(text)=>this.setState({name:text})}/>
                </View>
                <View style={styles.form_inputs}>
                    <View style={styles.form_input_title}>
                        <Text>Date Of Birth</Text>
                    </View>
                    <View>
                        <DatePicker date={this.state.dateofbirth} onDateChange={(date)=>this.setState({date:date})} mode="date" style={{height:50,width:350}}/>
                    </View>
                </View>
                <View style={styles.form_inputs}>
                    <DropDownPicker
                        items={this.genders}
                        value={this.state.gender}
                        placeholder="Gender"
                        open={this.state.open}
                        setOpen={(b) => this.setState({open : b})}
                        setValue={(val)=>{this.setState({gender:val})}}
                        style={styles.form_input}
                        dropDownContainerStyle={styles.form_input}
                    />
                </View>
                <View style={styles.form_inputs}>
                    <TextInput style={styles.form_input} keyboardType="number-pad" placeholder="Height (m)" ref="height" value={this.state.height} onChangeText={(text)=>this.setState({height:text})}/>
                </View>
                <View style={styles.form_inputs}>
                    <TextInput style={styles.form_input} keyboardType="number-pad" placeholder="Weight (kg)" ref="weight" value={this.state.weight} onChangeText={(text)=>this.setState({weight:text})}/>
                </View>
            </View>
        );
    }
}

export default ProfileBiography;