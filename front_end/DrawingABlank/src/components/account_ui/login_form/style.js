import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    mainContainer:{
        paddingTop:"10%",
        padding:15,
        color:"#000000"
    },
    titleBox:{
        alignItems:"center",
        paddingBottom:"30%"
    },
    title:{
        fontSize:36,
        color:"black",
        fontFamily:'Ubuntu-Light',
    },
    descriptionText:{
        fontSize:18,
        color:"black",
        fontFamily:'Ubuntu-Light',
    },
    credentialsInput:{
        borderColor:"#e8e1df",
        borderWidth:1,
        fontFamily:'Ubuntu-Light',
        borderRadius:10,
        width:"95%",
        marginBottom:"2%",
        color:"black"
    },
    loginForm:{
        paddingBottom:25,
    },
    loginFormInputs:{
        paddingTop:10,
        color:"black",
    },
    footer:{
    },
    footerText:{
        fontSize:18,
        fontFamily:'Ubuntu-Light',
        color:"black"
    }
})

const buttons = StyleSheet.create({
    loginFormButton:{
        width:"40%",
        left:"55%",
        borderRadius:5,
        borderColor:"black",
        borderWidth:1,
        backgroundColor:"#6db0f6",
    },
    buttonText:{
        textAlign:"center",
        fontFamily:'Ubuntu-Light',
        fontSize:24,
        color:'black'
    }
})

export {styles,buttons}