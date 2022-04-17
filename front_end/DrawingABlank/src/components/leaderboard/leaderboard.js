import React, {Component} from 'react';
import {Text, View, TextInput, ScrollView, Image, ActivityIndicator, Touchable} from 'react-native';
import { RotationGestureHandler, TouchableOpacity } from 'react-native-gesture-handler';
import PlayerCard from './playercard.js';
import {styles} from './style.js';
import MultiSelect from 'react-native-multiple-select';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {getDistanceLeaderboard,getPointsLeaderboard} from '../../api/api_leaderboard.js';
import { getProfile } from '../../api/api_profile.js';

import Overlay from '../../containers/Overlay';
import PlayerProfile from './playerProfile';
import { getUsername } from '../../api/api_networking.js';

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
        collectedLeaderboards:false,
        leaderboard_points:[],
        leaderboard_distance:[],
        default_pictures:{"ocean":require('../../assets/img/ocean.png'),"terra":require('../../assets/img/terra.png'),"windy":require('../../assets/img/windy.png')},
        api_to_label_teams:{"ocean":"Ocean","windy":"Windy","terra":"Terra"},
        overlayVisible: false,
        setOverlayVisible: value => {
            this.setState({overlayVisible: value});
        },
        obtainedProfileContent:false,
        profileContent:{},
        setOverlayContent: info => {
            this.setState({obtainedProfileContent:false},() => {
                getProfile(info.name).then((res) => {
                    console.log("GOT RESPONSE:"+JSON.stringify(res));
                    this.setState({profileContent:res});
                    this.setState({obtainedProfileContent:true});
                }).catch((err) => {
                    this.setState({overlayVisible:false});
                    alert(err);
                })
            });
        },
        player_card_points:{},
        player_card_distance:{},
        username_search:"",
    }

    getLeaderboards = () => {
        dateArgument = (this.state.dateChosen != "") ? this.state.dateChosen.toLocaleString('en-GB').split(',')[0] : "01/01/1970"
        teamArgument = this.state.selectedOptions;
        console.log("SENDING REQUEST WITH DATE " + dateArgument + " TEAMS " + teamArgument);
        getPointsLeaderboard(dateArgument, teamArgument)
        .then((points_res) => {
            console.log(points_res);
            this.setState({leaderboard_points:points_res},() => {this.getPlayerCardPoints()});
        }).then(() => {
            getDistanceLeaderboard(dateArgument,teamArgument)
            .then((distance_res) => {
                this.setState({leaderboard_distance:distance_res},() => {this.getPlayerCardDistance()});
            });
        });

        
    }

    getPlayerCardPoints = () => {
        getUsername().then((username)=>{
            console.log("OBTAINED USERNAME:"+username);
            var details = this.state.leaderboard_points.find(user => user.name==username);
            var index = this.state.leaderboard_points.findIndex(user => user.name==username);
            if(details!=undefined){
                this.setState({player_card_points:{
                    name:username,
                    picture:this.getDefaultPicture(details.team),
                    score:details.score,
                    rank:index
                }});
            }else{
                this.setState({player_card_points:{}});
            }
        });
    }

    getPlayerCardDistance = () => {
        getUsername().then((username) => {
            console.log("OBTAINED USERNAME:"+username);
            var details = this.state.leaderboard_distance.find(user => user.name==username);
            var index = this.state.leaderboard_distance.findIndex(user => user.name==username);
            if(details!=undefined){
                this.setState({player_card_distance:{
                    name:username,
                    picture:this.getDefaultPicture(details.team),
                    score:details.score,
                    rank:index
                }},() => {this.setState({collectedLeaderboards:true})});
            }else{
                this.setState({player_card_distance:{}}, () => {this.setState({collectedLeaderboards:true})});
            }
        })
    }

    setPoints = () =>{
        this.setState({points_selected:true});
    }

    setDistance = () =>{
        this.setState({points_selected:false});
    }

    setOptions = (selectedOptions) => {
        this.setState({collectedLeaderboards:false});
        this.setState({selectedOptions:selectedOptions},()=>{this.getLeaderboards()});
    }

    setDate = (date) =>{
        this.setState({dateChosen:date});
        this.hideDatePicker();
        this.setState({collectedLeaderboards:false},()=>{this.getLeaderboards()});
    }

    showDatePicker = () =>{
        this.setState({showDatePicker:true});
    }

    hideDatePicker = () =>{
        this.setState({showDatePicker:false});
    }
    
    scrollToIndex = (index) => {
        if(this.state.scrollViewRef){
            var ENTRY_HEIGHT = 100;
            this.state.scrollViewRef.scrollTo({
                x:0,
                y:ENTRY_HEIGHT*index,
                animated:true
            })
        }
    }

    getDefaultPicture = (teamName) => {
        return this.state.default_pictures[teamName];
    }

    setReference = (ref) => {
        this.setState({scrollViewRef:ref});
    }

    getPlayerCard = () => {
        if(!this.state.collectedLeaderboards || Object.keys(this.state.player_card_points).length==0){
            return (<View></View>);
        }
        return (this.state.points_selected) ? 
        <PlayerCard
            rank={this.state.player_card_points.rank+1}
            username={this.state.player_card_points.name}
            picture={this.state.player_card_points.picture}
            score={this.state.player_card_points.score}
            onPress={() => this.scrollToIndex(this.state.player_card_points.rank)}
        /> : 
        <PlayerCard
            rank={this.state.player_card_distance.rank+1}
            username={this.state.player_card_distance.name}
            picture={this.state.player_card_distance.picture}
            score={this.state.player_card_distance.score.toFixed(1)+"m"}
            onPress={() => this.scrollToIndex(this.state.player_card_distance.rank)}
        />
    }

    getOverlayContent = () => {
        return (
            (this.state.obtainedProfileContent) ?
            <PlayerProfile
            username={this.state.profileContent["username"]}
            email={'[USER.EMAIL]'}
            country={'UK'}
            totDist={this.state.profileContent["total_distance"]}
            totPoints={this.state.profileContent["total_points"]}
            totGrids={'[USER.TOTGRIDS]'}
            team={this.state.api_to_label_teams[this.state.profileContent["team"]]}
            bio={'[USER.BIO]'}
            picture={this.getDefaultPicture(this.state.profileContent["team"])}
            gender={this.state.profileContent["gender"]}
            /> : <ActivityIndicator size='large' color='#6db0f6'/> //Maybe make this a more pretty loading screen later.
        );
    }

    handleUserSearch = (text) =>{
        this.setState({username_search:text});
    }

    componentDidMount(){
        this.getLeaderboards();
    }

    

    render(){
        const onPress = info => {
            this.setState({obtainedProfileContent:false});
            this.state.setOverlayContent(info);
            this.state.setOverlayVisible(true);
        };
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
                    <View style={styles.filter_date}>
                        <MultiSelect
                        hideTags
                        items={this.state.options}
                        uniqueKey="id"
                        onSelectedItemsChange={this.setOptions}
                        selectedItems={this.state.selectedOptions}
                        selectText="Filter by team"
                        onChangeInput={(text) => console.log(text)}
                        tagRemoveIconColor="#fafafa"
                        tagBorderColor="#fafafa"
                        tagTextColor="#fafafa"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#CCC"
                        itemTextColor="#fafafa"
                        itemFontFamily="Ubuntu-Light"
                        displayKey="name"
                        textInputProps={{ editable: false }}
                        searchInputPlaceholderText=""
                        searchIcon={false}
                        hideSubmitButton={true}
                        styleItemsContainer={{backgroundColor:"#2179b8", borderColor:"#fafafa",borderWidth:1}}
                        styleDropdownMenuSubsection={{backgroundColor:"#2179b8", borderWidth:0}}
                        styleInputGroup={{backgroundColor:"#2179b8"}}
                        styleTextDropdown={{color:"#fafafa",fontFamily:"Ubuntu-Light"}}
                        styleTextDropdownSelected={{color:"#fafafa",fontFamily:"Ubuntu-Light"}}
                        />
                    </View>
                    <View style={styles.filter}>
                        <TouchableOpacity onPress={this.showDatePicker}>
                            <Text style={styles.filter_text}>
                                Filter by date: {this.state.dateChosen == "" ? "None" : this.state.dateChosen.getDate() + "/" + (this.state.dateChosen.getMonth()+1) + "/" + this.state.dateChosen.getFullYear()}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.search_bar}>
                    <TextInput style={styles.search_bar_input}
                        placeholder="Search user"
                        placeholderTextColor="#fafafa"
                        ref="usersearch"
                        onChangeText={this.handleUserSearch}    
                    />

                </View>
                <ScrollView style={styles.leaderboard_entries}
                            showsVerticalScrollIndicator={false} 
                            ref={(ref) => this.setReference(ref)}
                >
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

                    {!(this.state.collectedLeaderboards) && <ActivityIndicator color="#fafafa" size='large'/>}
                    {(this.state.collectedLeaderboards) && ((this.state.points_selected) ? this.state.leaderboard_points.map((info,index) => {{
                        if(info.name.includes(this.state.username_search)){
                        return (
                        <TouchableOpacity style={styles.leaderboard_entry} key={index} onPress={() => onPress(info)}>
                            <View style={styles.leaderboard_entry_rank}>
                                <Text style={styles.leaderboard_entry_rank_text}>{index+1}</Text>
                            </View>
                            <View style={styles.leaderboard_entry_picture}>
                                <Image
                                    source={this.getDefaultPicture(info.team)}
                                    style={styles.leaderboard_entry_picture_params}
                                />
                            </View>
                            <View style={styles.leaderboard_entry_title}>
                                <Text style={styles.leaderboard_entry_title_text}>{info.name}</Text>
                            </View>
                            <View style={styles.leaderboard_entry_team}>
                                <Text style={styles.leaderboard_entry_team_text}>{this.state.api_to_label_teams[info.team]}</Text>
                            </View>
                            <View style={styles.leaderboard_entry_score}>
                                <Text style={styles.leaderboard_entry_score_text}>{info.score}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                }}) : this.state.leaderboard_distance.map((info,index) => {{
                    if(info.name.includes(this.state.username_search)){
                        return (
                        <TouchableOpacity style={styles.leaderboard_entry} key={index} onPress={() => onPress(info)}>
                            <View style={styles.leaderboard_entry_rank}>
                                <Text style={styles.leaderboard_entry_rank_text}>{index+1}</Text>
                            </View>
                            <View style={styles.leaderboard_entry_picture}>
                                <Image
                                    source={this.getDefaultPicture(info.team)}
                                    style={styles.leaderboard_entry_picture_params}
                                />
                            </View>
                            <View style={styles.leaderboard_entry_title}>
                                <Text style={styles.leaderboard_entry_title_text}>{info.name}</Text>
                            </View>
                            <View style={styles.leaderboard_entry_team}>
                                <Text style={styles.leaderboard_entry_team_text}>{this.state.api_to_label_teams[info.team]}</Text>
                            </View>
                            <View style={styles.leaderboard_entry_score}>
                                <Text style={styles.leaderboard_entry_score_text}>{info.score.toFixed(1)+"m"}</Text>
                            </View>
                        </TouchableOpacity>
                    )}}}))}
                    <View style={{paddingBottom:20}}></View>
                </ScrollView>
                {/*Player card goes here*/}
                {this.getPlayerCard()}
                <Overlay
                visible={this.state.overlayVisible}
                setVisible={this.state.setOverlayVisible}
                children={this.getOverlayContent()}
                />
            </View>
        );
    }
}

export default Leaderboard;