import React, {Component} from 'react';
import {Text, View, TextInput, ScrollView, Image} from 'react-native';
import {styles} from './style.js';

class Leaderboard extends Component{
    render(){
        return(
            <View style={styles.leaderboard}>
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
                </ScrollView>
                {/*Player card goes here*/}
            </View>
        );
    }
}

export default Leaderboard;