import React, {Component} from 'react';
import {Text, View, TextInput, ScrollView, Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PlayerCard from './playercard.js';
import {styles} from './style.js';
import MultiSelect from 'react-native-multiple-select';
import DateTimePicker from 'react-native-modal-datetime-picker';

class Leaderboard extends Component{
    state={
        points_selected:true,
        options: [{
            id: 'Terra',
            name: 'Terra'
          }, {
            id: 'Ocean',
            name: 'Ocean'
          }, {
            id: 'Windy',
            name: 'Windy'
          }],
        selectedOptions:[],
        dateChosen:"",
        showDatePicker:false,
        open:false,
    }
    
    setPoints = () =>{
        this.setState({points_selected:true});
    }

    setDistance = () =>{
        this.setState({points_selected:false});
    }

    setOptions = (selectedOptions) =>{
        this.setState({selectedOptions:selectedOptions});
    }

    setDate = (date) =>{
        this.setState({dateChosen:date});
        this.hideDatePicker();
    }

    showDatePicker = () =>{
        this.setState({showDatePicker:true});
    }

    hideDatePicker = () =>{
        this.setState({showDatePicker:false});
    }
    

    render(){
        return(
            <View style={styles.leaderboard}>
                <DateTimePicker
                    isVisible={this.state.showDatePicker}
                    mode="date"
                    onConfirm={this.setDate}
                    onCancel={this.hideDatePicker}
                />
                <View style={styles.tab_buttons}>
                    <TouchableOpacity style={(this.state.points_selected) ? styles.tab_button_selected : styles.tab_button_default} onPress={this.setPoints}>
                        <Text style={styles.tab_text}>Points</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={(!this.state.points_selected) ? styles.tab_button_selected : styles.tab_button_default} onPress={this.setDistance}>
                        <Text style={styles.tab_text}>Distance</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.filters}>
                    <View style={styles.filter}>
                        <MultiSelect
                        hideTags
                        items={this.state.options}
                        uniqueKey="id"
                        onSelectedItemsChange={this.setOptions}
                        selectedItems={this.state.selectedOptions}
                        selectText="Filter by team"
                        onChangeInput={(text) => console.log(text)}
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#CCC"
                        itemTextColor="#000"
                        displayKey="name"
                        textInputProps={{ editable: false }}
                        searchInputPlaceholderText=""
                        searchIcon={false}
                        hideSubmitButton={true}
                        />
                    </View>
                    { !this.state.points_selected &&
                    <View style={styles.filter}>
                        <TouchableOpacity onPress={this.showDatePicker}>
                            <Text style={styles.filter_text}>Filter by date</Text>
                        </TouchableOpacity>
                    </View>
                    }
                </View>
                <ScrollView style={styles.leaderboard_entries} showsVerticalScrollIndicator={false}>
                    <View style={styles.leaderboard_entry}>
                        <View style={styles.leaderboard_entry_rank}>
                            <Text style={styles.leaderboard_entry_rank_text}>#</Text>
                        </View>
                        <View style={styles.leaderboard_entry_picture}>
                                
                            </View>
                        <View style={styles.leaderboard_entry_title}>
                            <Text style={styles.leaderboard_entry_title_text}>Username</Text>
                        </View>
                        <View style={styles.leaderboard_entry_team}>
                            <Text style={styles.leaderboard_entry_team_text}>Team</Text>
                        </View>
                        <View style={styles.leaderboard_entry_score}>
                            <Text style={styles.leaderboard_entry_score_text}>{this.state.points_selected ? "Score" : "Distance"}</Text>
                        </View>
                    </View>
                    {(this.state.points_selected) ? this.props.data.points.map((info,index) => {
                        if(this.state.selectedOptions.length == 0 || this.state.selectedOptions.includes(info.team)){
                        return (
                        <View style={styles.leaderboard_entry} key={index}>
                            <View style={styles.leaderboard_entry_rank}>
                                <Text style={styles.leaderboard_entry_rank_text}>{index+1}</Text>
                            </View>
                            <View style={styles.leaderboard_entry_picture}>
                                <Image
                                    source={info.picture}
                                    style={styles.leaderboard_entry_picture_params}
                                />
                            </View>
                            <View style={styles.leaderboard_entry_title}>
                                <Text style={styles.leaderboard_entry_title_text}>{info.title}</Text>
                            </View>
                            <View style={styles.leaderboard_entry_team}>
                                <Text style={styles.leaderboard_entry_team_text}>{info.team}</Text>
                            </View>
                            <View style={styles.leaderboard_entry_score}>
                                <Text style={styles.leaderboard_entry_score_text}>{info.points}</Text>
                            </View>
                        </View>
                    )}}) : this.props.data.distance.map((info,index) => {
                        if(this.state.selectedOptions.length == 0 || this.state.selectedOptions.includes(info.team)){
                        return (
                        <View style={styles.leaderboard_entry} key={index}>
                            <View style={styles.leaderboard_entry_rank}>
                                <Text style={styles.leaderboard_entry_rank_text}>{index+1}</Text>
                            </View>
                            <View style={styles.leaderboard_entry_picture}>
                                <Image
                                    source={info.picture}
                                    style={styles.leaderboard_entry_picture_params}
                                />
                            </View>
                            <View style={styles.leaderboard_entry_title}>
                                <Text style={styles.leaderboard_entry_title_text}>{info.title}</Text>
                            </View>
                            <View style={styles.leaderboard_entry_team}>
                                <Text style={styles.leaderboard_entry_team_text}>{info.team}</Text>
                            </View>
                            <View style={styles.leaderboard_entry_score}>
                                <Text style={styles.leaderboard_entry_score_text}>{info.points}</Text>
                            </View>
                        </View>
                    )}})}
                    <View style={{paddingBottom:20}}></View>
                </ScrollView>
                {/*Player card goes here*/}
                {(this.state.points_selected) ? 
                <PlayerCard
                    rank={this.props.data.userPointsIndex+1}
                    username={this.props.data.points[this.props.data.userPointsIndex].title}
                    picture={this.props.data.points[this.props.data.userPointsIndex].picture}
                    score={this.props.data.points[this.props.data.userPointsIndex].points}
                /> : 
                <PlayerCard
                    rank={this.props.data.userDistanceIndex+1}
                    username={this.props.data.distance[this.props.data.userDistanceIndex].title}
                    picture={this.props.data.distance[this.props.data.userDistanceIndex].picture}
                    score={this.props.data.distance[this.props.data.userDistanceIndex].points}
                />}
            </View>
        );
    }
}

export default Leaderboard;