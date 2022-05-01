//Event leaderboard for showing the status of each team currently
import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import {styles} from './style.js';


/**
 * This event leaderboard component takes the following props:
 * title : String
 * data : [{picture:require('...'), title:String, points:Integer}]
 */
class EventLeaderboard extends Component {
    componentDidMount(){
        console.log('AND HERE IS THE DATA');
        console.log('DATA:'+JSON.stringify(this.props.data));
    }
    render(){
        return(
            <View style={styles.leaderboard}>
                <View style={styles.leaderboard_title}>
                    <Text style={styles.leaderboard_title_text}>{this.props.title}</Text>
                </View>
                <View style={styles.leaderboard_entries}>
                    {this.props.data.map(info => (
                        <View style={styles.leaderboard_entry}>
                            <View style={styles.leaderboard_entry_picture}>
                                <Image
                                    source={info.picture}
                                    style={styles.leaderboard_entry_picture_params}
                                />
                            </View>
                            <View style={styles.leaderboard_entry_title}>
                                <Text style={styles.leaderboard_entry_title_text}>{info.title}</Text>
                            </View>
                            <View style={styles.leaderboard_entry_score}>
                                <Text style={styles.leaderboard_entry_score_text}>{info.points} points</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        );
    }
}

export default EventLeaderboard;