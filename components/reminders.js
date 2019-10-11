import React from "react"
import {Text, View, StyleSheet, AsyncStorage, Platform, Alert, PushNotificationIOS} from "react-native"
import DateTimePicker from "react-native-modal-datetime-picker";
import DatePicker from 'react-native-datepicker'

import PushNotification from 'react-native-push-notification';
import NotifService from './notifservice';
import * as firebaseSDK from 'firebase';
import firebase from 'react-native-firebase';

export class Schedule extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            morningTime: null,
            eveningTime: null,
            isDateTimePickerVisible: false,
            eveningFigurative: "Time to Snooze*Time to hit the sack! (remember to do your exercises and nutrition)",
            eveningLiteral: "Evening Reminder*Time to go to bed! (remember to do your exercises and nutrition)",
            morningFigurative: "Rise and Shine!*How was your Zzzz? (click to complete your daily metrics!)",
            morningLiteral: "Morning Notification*How was your night? (click to complete your daily metrics!)",
        }
        this._getMorningTime();
        this._getEveningTime();

        notifcationLocation = "notifications/" 
        this.notifRef = firebaseSDK.database().ref(notifcationLocation);
        this.notif = new NotifService();
    }

    onRegister(token) {
        Alert.alert("Registered !", JSON.stringify(token));
        console.log(token);
        this.setState({ registerToken: token.token, gcmRegistered: true });
      }
    
      onNotif(notif) {
        console.log(notif);
        Alert.alert(notif.title, notif.message);
      }

    componentDidMount(){
        this.listenForItems(this.notifRef);
    }

    listenForItems(notifRef) {
        var notifications = [];

        notifRef.on('value',(snap) => {
            
            var eveningFigurativeDB = snap.child("eveningFigurative");
            var eveningLiteralDB = snap.child("eveningLiteral");
            var morningFigurativeDB = snap.child("morningFigurative");
            var morningLiteralDB = snap.child("morningLiteral");

            console.log("eveningFigurative is " + eveningLiteralDB.toJSON());
            this.setState(
                {eveningFigurative : eveningFigurativeDB.toJSON(), 
                eveningLiteral : eveningLiteralDB.toJSON(), 
                morningFigurative : morningFigurativeDB.toJSON(), 
                morningLiteral : morningLiteralDB.toJSON()})
        });

        
    }

    onRegister(token) {
        Alert.alert("Registered !", JSON.stringify(token));
        console.log(token);
        this.setState({ registerToken: token.token, gcmRegistered: true });
      }
    
      
    
      handlePerm(perms) {
        Alert.alert("Permissions", JSON.stringify(perms));
      }

    _StoreMorningTime = async (value) => {
        console.log("morning store " + value)
        try {
            await AsyncStorage.setItem('MORNINGTIME', value)
        }catch (error){

        }
    }

    _StoreEveningTime = async (value) => {
        try {
            await AsyncStorage.setItem('EVENINGTIME', value)
        }catch (error){

        }
    }

    _getMorningTime = async () => {

            const value = await AsyncStorage.getItem('MORNINGTIME');
            console.log("GETTING MORNING " + value)
            this.setState({morningTime:value})

    }

    _getEveningTime = async () => {

        try {
            const value = await AsyncStorage.getItem('EVENINGTIME');
            this.setState({eveningTime:value})
        } 
        catch(error)
        {

        }
    }

    changeMorningTime = (time) => {
        if(time !== this.state.morningTime)
        {
            this.setState({morningTime: time})
            this._StoreMorningTime(time)
            this.resetMorningNotifications()
            this.setMorningReminder(time)

        }
        
    }

    changeEveningTime =  (time) => {
        if(time !== this.state.eveningTime)
        {
            this.setState({eveningTime: time})
            this._StoreEveningTime(time)
            this.resetEveningNotifications()
            this.setEveningReminder(time)
        }
    }

    setMorningReminder = (newMorning) => {
        console.log(newMorning)
        values = newMorning.split(':')
        //get current time
                //set new time with todays date
        
        newTime = new Date()
        newTime.setUTCHours(values[0],values[1],'00')
        newTime = this.convertDateToUTC(newTime)
        console.log("new time is" + newTime)
        result = this.DateDiff(newTime, new Date())
                // newdate - current date if negative add 24h
        if(result <= 0)
        {
            newTime = new Date(newTime.getTime() + 60 * 60 * 24 * 1000);
            result = this.DateDiff(newTime, new Date())
        }
        //calculate difference in milliseconds   

        
        if( Platform.OS === 'android')
        {
            notificationParts = this.state.morningFigurative.split('*');
            console.log("making android morning notif " + result)
            this.notif.scheduleNotif(1, result, notificationParts[0], notificationParts[1]);
        }
        else
        {
            console.log("morningLiteral notification is " + this.state.morningLiteral)
            notificationParts = this.state.morningLiteral.split('*');
          PushNotificationIOS.scheduleLocalNotification({
            fireDate: new Date(Date.now() + result),
            alertTitle: notificationParts[0],
            alertBody: notificationParts[1],
            repeatInterval: "minute",
            userInfo: { id: 1 }
          });
        }
    }

    setEveningReminder = (newEvening) => {
        console.log(newEvening)
        values = newEvening.split(':')
        //get current time
                //set new time with todays date
        
        newTime = new Date()
        newTime.setUTCHours(values[0],values[1],'00')
        newTime = this.convertDateToUTC(newTime)
        console.log("new time is" + newTime)
        result = this.DateDiff(newTime, new Date())
                // newdate - current date if negative add 24h
        if(result <= 0)
        {
            newTime = new Date(newTime.getTime() + 60 * 60 * 24 * 1000);
            result = this.DateDiff(newTime, new Date())
        }
        //calculate difference in milliseconds

        console.log("notification will fire in " + result / 1000 / 60 + " minutes")
        if( Platform.OS === 'android')
        {
            notificationParts = this.state.eveningFigurative.split('*');
            this.notif.scheduleNotif(2, result, notificationParts[0],notificationParts[1]);
        }
        else
        {
            notificationParts = this.state.eveningLiteral.split('*');
            
          PushNotificationIOS.scheduleLocalNotification({
            fireDate: new Date(Date.now() + 30),
            alertTitle: notificationParts[0],
            alertBody: notificationParts[1],
            alertAction: 'view',
            repeatInterval: "minute",
            userInfo: { id: 2 }
          });
        }
    }   

    resetMorningNotifications = () => {
        if( Platform.OS ==='android')
        {
            this.notif.cancelNotif(1);
        }
        else
        {
            PushNotificationIOS.cancelLocalNotifications({id:1});
        }
        
      }

    resetEveningNotifications = () => {
        if( Platform.OS ==='android')
        {
            this.notif.cancelNotif(2);
        }
        else
        {
            PushNotificationIOS.cancelLocalNotifications({id:2});
        }
        
      }

    DateDiff = (date1, date2) => {
        console.log(date1)
        console.log(date2)
        console.log("difference is in minutes ")
        console.log(date1 / 60 / 1000 - date2 / 60 / 1000)
        return date1 - date2;
    }

    convertDateToUTC = (date) => { 
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
    }

    render(){
        return(
            <View style={styles.row}>
                <View style={styles.rowInner}>
                    <Text style={{fontSize: 18}}>Night Reminder</Text>
                    <DatePicker
                        style={{width: "80%", marginVertical: 5}}
                        date={this.state.eveningTime}
                        mode="time"
                        format="h:mm A"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        minuteInterval={1}
                        onDateChange={this.changeEveningTime}
                    />
                </View>
                
                <View style={styles.rowInner}>
                    <Text style={{fontSize: 18}}>Morning Reminder</Text>
                    <DatePicker
                        style={{width: "80%", marginVertical: 5}}
                        date={this.state.morningTime}
                        mode="time"
                        format="h:mm A"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        minuteInterval={1}
                        onDateChange={this.changeMorningTime}
                    />
                </View>

            </View>
        )
    } 
    
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: "space-evenly",
        marginHorizontal: 10
      },
      rowInner: {
          alignItems: "center",
      }
})
