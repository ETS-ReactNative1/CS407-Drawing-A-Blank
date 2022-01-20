/**
 * This stylesheet has been obtained from Charles Hampton-Evans' [ID:1804656] CS310 Project, who is a member of the front-end team.
 */

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    main:{
        flex: 1,
        backgroundColor: '#fff',
        alignItems:"center",
        alignContent:"center",
        width:"100%",
    },
    welcome_title:{
        alignItems:"center",
        backgroundColor:'#fff',
        top:"5%",
        paddingBottom:"2%"
    },
    title_text:{
        fontSize:36,
        color:"#6db0f6",
        paddingBottom:"10%",
        textAlign:"justify"
    },
    body_explanation:{
        alignContent:"center"
    },
    body_text:{
        fontSize:20,
        color:"#a3a3a3",
        paddingBottom:"10%",
    },
    create_profile:{
        width:"85%"
    },
    form_inputs:{
        paddingTop:10,
        width:"100%",
        left:"5%"
    },
    form_input:{
        fontFamily:"Rubik-VariableFont_wght",
        borderColor:"#e8e1df",
        borderWidth:1,
        width:350,
        paddingBottom:10
    },
    form_input_title:{
        width:"100%",
    },
    continue_button:{
        paddingTop:20,
        width:"90%",
    },
    character_counter:{//Kind of want this in the centre but fix later
        paddingTop:20
    },
});

export {styles};