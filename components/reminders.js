import React from "react"
import {Text, View, StyleSheet, AsyncStorage, Platform} from "react-native"
import DateTimePicker from "react-native-modal-datetime-picker";
import DatePicker from 'react-native-datepicker'

import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from 'PushNotificationIOS'

export class Schedule extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            morningTime: null,
            eveningTime: null,
            isDateTimePickerVisible: false,
        }

        this._getMorningTime();
        this._getEveningTime();
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

    changeMorningTime =  (time) => {
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

        console.log("notification will fire in " + result / 1000 / 24 + " minutes")
        if( Platform.OS === 'android')
        {
          PushNotification.localNotificationSchedule({
            date: new Date(Date.now() + result),
            id: '1',
            message: "Morning Notification", // (required)
          })
        }
        else
        {
          PushNotificationIOS.scheduleLocalNotification({
            fireDate: new Date(Date.now() + result),
            alertTitle: "do it",
            alertBody: "Morning Notification",
            //repeatInterval: "minute"
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

        console.log("notification will fire in " + result / 1000 / 24 + " minutes")
        if( Platform.OS === 'android')
        {
          PushNotification.localNotificationSchedule({
            date: new Date(Date.now() + result),
            id: '2',
            message: "Hello Youtube", // (required)
          })
        }
        else
        {
          PushNotificationIOS.scheduleLocalNotification({
            fireDate: new Date(Date.now() + result),
            alertTitle: "do it",
            alertBody: "Evening Notification",
            //repeatInterval: "minute"
            userInfo: { id: 2 }
          });
        }
    }   


    resetMorningNotifications = () => {
        PushNotification.cancelLocalNotifications({id:'1'});
        PushNotificationIOS.cancelLocalNotifications({id:1});
      }

    resetEveningNotifications = () => {
        PushNotification.cancelLocalNotifications({id:'2'});
        PushNotificationIOS.cancelLocalNotifications({id:2});
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
            <View styles={styles.row}>
                <Text>Morning Reminder</Text>
                <DatePicker
                    style={{width: 200}}
                    date={this.state.morningTime}
                    mode="time"
                    format="HH:mm"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    minuteInterval={10}
                    onDateChange={this.changeMorningTime}
                />

                <Text>Evening Reminder</Text>
                <DatePicker
                    style={{width: 200}}
                    date={this.state.eveningTime}
                    mode="time"
                    format="HH:mm"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    minuteInterval={10}
                    onDateChange={this.changeEveningTime}
                />
            </View>
        )
    }
    
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', 
      }
})
