import React, {Component} from 'react';
import {Text, View, TextInput, ScrollView, Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PlayerCard from './playercard.js';
import {styles} from './style.js';
import MultiSelect from 'react-native-multiple-select';

class Leaderboard extends Component{
    state={
        points_selected:true,
        options: [{
            id: 'terra',
            name: 'Terra'
          }, {
            id: 'ocean',
            name: 'Ocean'
          }, {
            id: 'windy',
            name: 'Windy'
          }],
        selectedOptions:[],
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

    render(){
        return(
            <View style={styles.leaderboard}>
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
                            <Text style={styles.leaderboard_entry_score_text}>Score</Text>
                        </View>
                    </View>
                    {this.props.data.map((info,index) => (
                        <View style={styles.leaderboard_entry}>
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
                                <Text style={styles.leaderboard_entry_team_text}>Team</Text>
                            </View>
                            <View style={styles.leaderboard_entry_score}>
                                <Text style={styles.leaderboard_entry_score_text}>{info.points}</Text>
                            </View>
                        </View>
                    ))}
                    <View style={{paddingBottom:20}}></View>
                </ScrollView>
                {/*Player card goes here*/}
                <PlayerCard
                    rank={123}
                    username="Our user"
                    picture={require('../../assets/img/terra.png')}
                    score={7}
                />
            </View>
        );
    }
}

export default Leaderboard;