import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    mainContainer:{
        paddingTop:"10%",
        padding:15,
        color:"#000000",
        backgroundColor:'#2179b8',
        height:'100%'
    },
    titleBox:{
        alignItems:"center",
        paddingBottom:"30%"
    },
    title:{
        fontSize:36,
        color:"#fafafa",
        fontFamily:'Ubuntu-Light',
    },
    descriptionText:{
        fontSize:18,
        color:"#fafafa",
        fontFamily:'Ubuntu-Light',
    },
    credentialsInput:{
        borderColor:"#e8e1df",
        borderWidth:1,
        fontFamily:'Ubuntu-Light',
        borderRadius:10,
        width:"95%",
        marginBottom:"2%",
        color:"#fafafa",
        backgroundColor:"white",
        color:"black"
    },
    loginForm:{
        paddingBottom:25,
    },
    loginFormInputs:{
        paddingTop:10,
        color:"#fafafa",
    },
    footer:{
    },
    footerText:{
        fontSize:18,
        fontFamily:'Ubuntu-Light',
        color:"#fafafa"
    }
})

const buttons = StyleSheet.create({
    loginFormButton:{
        width:"40%",
        left:"55%",
        borderRadius:5,
        borderColor:"white",
        borderWidth:1,
        backgroundColor:"#2796e6",
    },
    loading:{
        width:"40%",
        left:"55%",
    },
    buttonText:{
        textAlign:"center",
        fontFamily:'Ubuntu-Light',
        fontSize:24,
        color:'#fafafa',
        marginBottom:5
    }
})

export {styles,buttons}