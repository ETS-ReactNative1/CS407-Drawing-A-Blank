import React, {Component} from 'react';
import {Text, View, TextInput, ScrollView, Image} from 'react-native';
import {styles} from './style.js';

class PlayerCard extends Component{
    render(){
        return(
            <View style={styles.playercard}>
                <View style={styles.leaderboard_entry_rank}>
                    <Text style={styles.leaderboard_entry_rank_text}>{this.props.rank}</Text>
                </View>
                <View style={styles.leaderboard_entry_picture}>
                    <Image
                        source={this.props.picture}
                        style={styles.leaderboard_entry_picture_params}
                    />
                </View>
                <View style={styles.leaderboard_entry_title}>
                    <Text style={styles.leaderboard_entry_title_text}>{this.props.username}</Text>
                </View>
                <View style={styles.leaderboard_entry_score}>
                    <Text style={styles.leaderboard_entry_score_text}>{this.props.score}</Text>
                </View>
            </View>
        )
    }
}
export default PlayerCard;