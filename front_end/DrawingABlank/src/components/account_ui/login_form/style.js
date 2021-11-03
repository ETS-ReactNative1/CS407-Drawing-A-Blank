import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    Text:{
        //Font goes here
    },
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
        color:"black"
    },
    descriptionText:{
        fontSize:18,
        color:"black"
    },
    credentialsInput:{
        borderColor:"#e8e1df",
        borderWidth:1,
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
        fontSize:18
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
        fontSize:24
    }
})

export {styles,buttons}