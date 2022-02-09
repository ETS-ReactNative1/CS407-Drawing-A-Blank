import React, {Component, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import PlayerCard from './playercard.js';
import {styles} from './style.js';
import Overlay from '../../containers/Overlay';
import PlayerProfile from './playerProfile';

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overlayVisible: false,
      overlayContent: <View />,
      setOverlayVisible: value => {
        this.setState({overlayVisible: value});
      },
      setOverlayContent: info => {
        this.setState({
          overlayContent: (
            <PlayerProfile
              username={info.title}
              email={'[USER.EMAIL]'}
              country={'UK'}
              totDist={'[USER.TOTDIST]'}
              totPoints={'[USER.TOTPOINTS]'}
              totGrids={'[USER.TOTGRIDS]'}
              team={'[USER.TEAM]'}
              bio={'[USER.BIO]'}
              picture={info.picture}
              gender={'[USER.GENDER]'}
            />
          ),
        });
      },
    };
  }

  render() {
    const onPress = info => {
      this.state.setOverlayContent(info);
      this.state.setOverlayVisible(true);
    };

    return (
      <View style={styles.leaderboard}>
        <ScrollView
          style={styles.leaderboard_entries}
          showsVerticalScrollIndicator={false}>
          <View style={styles.leaderboard_entry}>
            <View style={styles.leaderboard_entry_rank}>
              <Text style={styles.leaderboard_entry_rank_text}>#</Text>
            </View>
            <View style={styles.leaderboard_entry_picture} />
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
          {this.props.data.map((info, index) => (
            <TouchableOpacity
              style={styles.leaderboard_entry}
              onPress={() => onPress(info)}>
              <View style={styles.leaderboard_entry_rank}>
                <Text style={styles.leaderboard_entry_rank_text}>
                  {index + 1}
                </Text>
              </View>
              <View style={styles.leaderboard_entry_picture}>
                <Image
                  source={info.picture}
                  style={styles.leaderboard_entry_picture_params}
                />
              </View>
              <View style={styles.leaderboard_entry_title}>
                <Text style={styles.leaderboard_entry_title_text}>
                  {info.title}
                </Text>
              </View>
              <View style={styles.leaderboard_entry_team}>
                <Text style={styles.leaderboard_entry_team_text}>Team</Text>
              </View>
              <View style={styles.leaderboard_entry_score}>
                <Text style={styles.leaderboard_entry_score_text}>
                  {info.points}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{paddingBottom: 20}} />
        </ScrollView>
        {/*Player card goes here*/}
        <PlayerCard
          rank={123}
          username="Our user"
          picture={require('../../assets/img/terra.png')}
          score={7}
        />
        <Overlay
          visible={this.state.overlayVisible}
          setVisible={this.state.setOverlayVisible}
          children={this.state.overlayContent}
        />
      </View>
    );
  }
}

export default Leaderboard;
