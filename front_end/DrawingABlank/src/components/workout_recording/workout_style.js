import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    workout_button:{
        borderRadius:5,
        borderColor:"black",
        borderWidth:1,
        backgroundColor:"#6db0f6",
        width:350
    },

    workout_button_text:{
        textAlign:"center",
        fontSize:24,
        color:"#fafafa",
        fontFamily:"Ubuntu-Light"
    },

    activity_loader:{
        marginTop:"70%",
        flexDirection:"column",
    },
    loading_text:{
        fontFamily:"Ubuntu-Light",
        color:"#fafafa",
        fontSize:30,
        textAlign:"center",
        paddingBottom:10
    },
    quote_text:{
        fontFamily:"Ubuntu-Light",
        color:"#fafafa",
        fontSize:16,
        textAlign:"center",
        paddingTop:10
    }
});

export {styles};