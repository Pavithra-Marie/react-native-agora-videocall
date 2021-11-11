import {Dimensions, StyleSheet} from 'react-native'

const dimensions = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
}

export default StyleSheet.create({
    max: {
        flex: 1,
        backgroundColor:'#f1f1f1'
    },
    buttonHolder: {
        height: 100,
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    button: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 25,
    },
    buttonText: {
        // color: '#000',
        
    },
    buttonCallText: {
        color: '#0000ff', 
        paddingRight:10,
        fontSize:16    
    },
    buttonCall: {
        paddingHorizontal: 30,
        paddingVertical: 12,
        flexDirection:'row',
        backgroundColor: '#fff',
        borderRadius: 25,
    },
    fullView: {
        width: dimensions.width,
        height: dimensions.height - 100,
    },
    remoteContainer: {
        width: '100%',
        height: 150,
        position: 'absolute',
        top: 5
    },
    remote: {
        width: 150,
        height: 150,
        marginHorizontal: 2.5
    },
    noUserText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#0093E9',
    },
})