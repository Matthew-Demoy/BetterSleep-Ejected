import React from 'react'
import {Text, View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native'
import StreakCalendar from './StreakCalendar'
import StatBox from './StatBox'

import * as firebase from 'firebase';
import {Schedule} from './reminders'



class Profile extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            username:"PlaceHolder1",
            name:"Matt Demoy",
            nameInput: "",
            dialogVisible: false
        }
    }

    showDialog = () => {
        this.setState({ dialogVisible: true });
      };

      handleCancel = () => {
        this.setState({ dialogVisible: false , nameInput:''});
      };
    
      handleChange = () => {
        changedName = this.state.nameInput
        this.setState({ dialogVisible: false, name: changedName, nameInput:'' });
      };

      onSignoutPress = () => {
        firebase.auth().signOut();
        this.props.navigation.navigate('intro')
      }

      onSettingsPress = () => {
        this.props.navigation.navigate('Settings')
      }

    render() {
        return (
            <ScrollView>
                <View style={{paddingTop:10}} />
                <StreakCalendar/>
                <View style={{paddingTop:10}} />
                <StatBox/>
                <View style={{paddingTop:10}} />

                <Schedule/>
                <TouchableOpacity style={{borderWidth:1, paddingVertical:15}} onPress={this.onSettingsPress}>
                    <Text style={{alignSelf:'center', fontSize:20}}>Settings</Text>
                </TouchableOpacity>
                <View style={{paddingTop:10}} />
                <TouchableOpacity style={{borderWidth:1, paddingVertical:15}} onPress={this.onSignoutPress}>
                    <Text style={{alignSelf:'center', fontSize:20}}>Sign Out</Text>
                </TouchableOpacity>

            </ScrollView>
        )
    }
}

export default Profile;

const styles = StyleSheet.create({
    button : {
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        marginTop : 10,
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
    },
    accountText : {
        fontSize: 15,
    },
    ScreenTitle: {
        color: 'white',
        fontSize : 25,  
    },

})