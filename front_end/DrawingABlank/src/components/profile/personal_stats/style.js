import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    main:{
        padding:20
    },
    extraData:{
        
    },
    singleData:{
        borderTopColor:"#979797",
        borderTopWidth:1,
        display:"flex",
        padding:10,
        paddingTop:15,
        flexDirection:"row",
        flexWrap:"wrap",
    },
    singleDataTitle:{
        alignItems:'flex-start',
        flex:0.7
    },
    singleDataValue:{
        alignItems:'flex-end',
        flex:0.3
    },
    singleDataText:{
        fontSize:20
    }
})
export {styles}