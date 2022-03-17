import { StyleSheet } from 'react-native';


export const styles = StyleSheet.create({
    leaderboard:{
        padding:15,
        backgroundColor:'#2179b8',
        height:"100%"
    },
    leaderboard_title:{
        paddingBottom:5
    },
    leaderboard_title_text:{
        color:"#fafafa",
        fontSize:32,
        fontFamily:"Ubuntu-Light",
        textAlign:'left'
    },
    leaderboard_entries:{
        paddingTop:15,
        height:"60%",
    },
    leaderboard_entry:{
        borderBottomColor:"#fafafa",
        borderBottomWidth:1,
        flexDirection:'row',
        paddingBottom:2,
    },
    playercard:{
        borderColor:"#fafafa",
        borderWidth:1,
        flexDirection:'row',
        paddingLeft:10,
        marginTop:20
    },
    leaderboard_entry_picture:{
        alignContent:'flex-start',
        padding:10,
        width:64,
        height:64,
    },
    leaderboard_entry_picture_params:{
        width:48,
        height:48
    },
    leaderboard_entry_score:{
        justifyContent:'center',
        alignItems:'flex-end',
        marginLeft:'auto',
        paddingRight:10,
        width:"20%"
    },
    leaderboard_entry_rank:{
        justifyContent:'center',
        width:25,
    },  
    leaderboard_entry_rank_text:{
        fontSize:14,
        fontFamily:"Ubuntu-Light",
        color:"#fafafa",
    },
    leaderboard_entry_team:{
        justifyContent:"center",
        alignItems:'flex-start',
        marginLeft:'auto',
        paddingRight:20,
        width:"20%"
    },
    leaderboard_entry_team_text:{
        fontSize:14,
        color:"#fafafa",
        fontFamily:"Ubuntu-Light",
        position:'absolute'
    },
    leaderboard_entry_title:{
        alignContent:'space-around',
        justifyContent:'center',
        width:"30%"
    },
    leaderboard_entry_title_text:{
        fontSize:14,
        fontFamily:"Ubuntu-Light",
        color:"#fafafa",
    },
    leaderboard_entry_score_text:{
        fontSize:14,
        color:"#fafafa",
        fontFamily:"Ubuntu-Light",
        textAlign:'right'
    },
    summary:{
        padding:20,
    },
    summary_title:{
    },
    summary_title_text:{
        fontSize:32,
        color:"#fafafa",
        textAlign:"center"
    },
    summary_description_text:{
        fontSize:20,
        color:"#fafafa",
        textAlign:"center"
    },
    summary_status:{
    },
    summary_status_winner:{
        color:"#0fd945",
        fontSize:26,
        textAlign:"center"
    },
    summary_status_loser:{
        color:"#de1610",
        fontSize:26,
        textAlign:"center"
    },
    tab_buttons:{
        width:300,
        alignContent:"center",
        alignItems:"center",
        left:30,
        flexDirection:"row",
        borderColor:"#fafafa",
        borderWidth:1,
        borderTopLeftRadius:5,
        borderBottomLeftRadius:5
    },
    tab_button_selected:{
        width:150,
        borderRightWidth:1,
        borderColor:"#fafafa",
        backgroundColor:"#6db0f6",
    },
    tab_button_default:{
        width:150,
        borderRightWidth:1,
        borderColor:"#fafafa",
        backgroundColor:"#b0d2f5",
    },
    tab_text:{
        color:"#fafafa",
        fontFamily:"Ubuntu-Light",
        textAlign:"center"
    },
    filters:{
        paddingTop:10,
        marginLeft:10,
        paddingBottom:10,
        flexDirection:'row',
    },
    filter:{
        width:200,
        justifyContent:"center",
        paddingRight:20
    },
    filter_date:{
        top:5,
        width:200,
        justifyContent:"center",
        paddingRight:20
    },
    filter_text:{
        color:"#fafafa",
        fontFamily:"Ubuntu-Light",
        fontSize:14
    },

  container: {
    width: '100%',
    flexDirection: 'column',
  },

  header: {},
  headerContent: {
    padding: 30,
    paddingBottom: -20,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '600',
  },
  userInfo: {
    fontSize: 16,
    color: '#778899',
    fontWeight: '600',
  },

  profileBody: {
    height: 500,
  },
  profileItem: {
    flexDirection: 'row',
  },
  profileInfoContent: {
    flex: 2,
    marginLeft: -120,
  },
  profileIconContent: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  profileIcon: {
    width: 30,
    height: 30,
    marginTop: 20,
  },
  profileInfo: {
    fontSize: 18,
    marginTop: 20,
    color: '#000000',
  },

  profileSubInfo: {
    fontSize: 15,
    marginTop: 5,
    color: '#1a1a1a',
  },

  search_bar:{
  },

  search_bar_input:{
    borderColor:"#fafafa",
    borderWidth:1,
    borderRadius:10,
    width:"95%",
    marginBottom:"5%",
    color:"#fafafa",
    fontFamily:"Ubuntu-Light"
  }
});