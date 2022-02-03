//Event leaderboard for showing the status of each team currently
import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import {styles} from './style.js';

class EventLeaderboard extends Component {


    componentDidMount(){
        console.log(this.props.data);
    }

    getAvatarSource = (team) =>{
        if(team==="terra")
            return require('../../assets/img/terra.png');
        if(team==="ocean")
            return require('../../assets/img/ocean.png');
        if(team==="windy")
            return require('../../assets/img/windy.png');
    }

    render(){
        return(
            <View style={styles.leaderboard}>
                <View style={styles.leaderboard_title}>
                    <Text style={styles.leaderboard_title_text}>{this.props.title}</Text>
                </View>
                <View style={styles.leaderboard_entries}>
                    {/* Need to map this with data prop later */}
                    {/*}
                    <View style={styles.leaderboard_entry}>
                        <View style={styles.leaderboard_entry_picture}>
                            <Image
                                source={require('../../assets/img/windy.png')}
                                style={styles.leaderboard_entry_picture_params}
                            />
                        </View>
                        <View style={styles.leaderboard_entry_title}>
                            <Text style={styles.leaderboard_entry_title_text}>Windy</Text>
                        </View>
                        <View style={styles.leaderboard_entry_score}>
                            <Text style={styles.leaderboard_entry_score_text}>124 points</Text>
                        </View>
                    </View>
                    <View style={styles.leaderboard_entry}>
                        <View style={styles.leaderboard_entry_picture}>
                            <Image
                                source={require('../../assets/img/ocean.png')}
                                style={styles.leaderboard_entry_picture_params}
                            />
                        </View>
                        <View style={styles.leaderboard_entry_title}>
                            <Text style={styles.leaderboard_entry_title_text}>Windy</Text>
                        </View>
                        <View style={styles.leaderboard_entry_score}>
                            <Text style={styles.leaderboard_entry_score_text}>124 points</Text>
                        </View>
                    </View>
                    */}
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