import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    main:{
        flex: 1,
        backgroundColor: '#2179b8',
        alignItems:"center",
        alignContent:"center",
        width:"100%",
        height:"100%",
        padding:"2.5%"
    },
    title_text:{
        fontSize:36,
        color:"#fafafa",
        paddingBottom:"10%",
        textAlign:"justify",
        fontFamily:'Ubuntu-Light'
    },
    description:{
        paddingBottom:30
    },
    description_text:{
        fontFamily:'Ubuntu-Light',
        color:'#fafafa',
        fontSize:24
    },
    continue_button:{
        paddingTop:20,
        width:"90%",
    },
})