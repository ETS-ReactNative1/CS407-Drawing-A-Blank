import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    mainContainer:{
        backgroundColor:'#2179b8',
        height:'100%',
        flex:1,
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    loadingBox:{
        justifyContent:'center',
        alignItems:'center',
        height:100,
        borderColor:'white',
        borderWidth:2
    },  
    loading_text_title:{
        fontSize:36,
        textAlign:'center',
        marginBottom:25,
        color:'#fafafa',
        fontFamily:'Ubuntu-Light'
    },
    loading_text_description:{
        fontSize:24,
        textAlign:'center',
        marginTop:25,
        color:'#fafafa',
        fontFamily:'Ubuntu-Light'
    }
});