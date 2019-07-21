import React from 'react'
import {View, ActivityIndicator, Platform} from 'react-native'
import {JournalBoxList} from './JournalBox'
import PropTypes from 'prop-types';
import * as firebaseSDK from 'firebase';
import firebase from 'react-native-firebase';
import PushNotificationIOS from 'PushNotificationIOS'

//Journal screen displays the current journal entries and has a button to submit more entries.
class Journal extends React.Component{

      constructor(props) {
        super(props);
        this.state = {
          journal : null,
          weeklyInfoNotifications: null,
          weeklyTipsNotifications: null
        };

        //get the user data from firebase
        var user = firebaseSDK.auth().currentUser
        userLocation = "users/" + user.uid + "/journals"
        this.itemsRef = firebaseSDK.database().ref(userLocation).orderByChild('date');
        this.tipsRef = firebaseSDK.database().ref("/SleepTips").orderByChild('date');
        this.informationRef = firebaseSDK.database().ref("/SleepInformation").orderByChild('date');
      }
      


      componentDidMount() {
        this.createNotificationListeners();
        PushNotificationIOS.addEventListener('localNotification', () => {this.props.navigation.navigate('Entry');});
        this.listenForItems(this.itemsRef)
        console.log("didmount listen for tips")
        this.listenForTipsNotifications(this.tipsRef)
        console.log("didmount listen for info")
        this.listenForInfoNotifications(this.informationRef)
        this._onBoardComplete()
      }

      async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
          const { title, body } = notification;
          console.log('onNotification:');
          this.props.navigation.navigate('Entry');
           //this.showAlert(title, body);
           //alert('message');
        });
      
    
         /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
          const { title, body } = notificationOpen.notification;
          //this.showAlert(title, body);
        });
    
        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
          const { title, body } = notificationOpen.notification;
          console.log('getInitialNotification:');
          NavigationService.navigate("Entry");
          //this.showAlert(title, body);
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
          //process data message
          console.log("message is " + JSON.stringify(message));
        });
      }

      _onBoardComplete = async () => {
        console.log("finishing onboarding ")
        try {
          await AsyncStorage.setItem('FIRSTTIME', 'false');
          
        } catch (error) {
          // Error saving data
        }
        console.log("onboarding finish")
      };

      //Firebase Listens for new items from the database to add to the journal state
      listenForItems(itemsRef) {
        itemsRef.on('value', (snap) => {
    
          // get children as an array
          var entries = [];
          snap.forEach((child) => {
            console.log("bedTime in db " + child.val().bedTime)
            entries.push({
              journal: child.val().text,
              didExercise: child.val().didExercise,
              didNutrition: child.val().didNutrition,
              grade: child.val().emotion,
              date: child.val().date,
              id: child.key,
              wakeTime : child.val().wakeTime,
              bedTime : child.val().bedTime,
              
            });
          });
        
          entries.sort(function(a,b){
            return new Date(b.date) - new Date(a.date) })
    
          this.setState({
            journal: entries
          });
    
        });
      }
    

      createWeeklyNotifications(){

        firebase.notifications().removeAllDeliveredNotifications()
        
        const channel = new firebase.notifications.Android.Channel(
          'dep_time_tracing',
          'Time tracking',
          firebase.notifications.Android.Importance.Max
        ).setDescription('Hint users how much left time o drive to next dep');
        firebase.notifications().android.createChannel(channel);
    
        this.state.weeklyTipsNotifications.forEach(function(notif) {
         
          if(Platform.OS == 'android')
          {
            const localNotification = new firebase.notifications.Notification({
              sound: 'default',
            // show_in_foreground: true,
            // show_in_background: true,
          })
              .setNotificationId('hh2')
              .setTitle('New Sleep Info')
              .setBody(notif.FigurativeTitle)
              .setData({
                type: 'start',
            })
              .android.setChannelId('dep_time_tracing') // e.g. the id you chose above
              .android.setSmallIcon('ic_launcher') // create this icon in Android Studio
              .android.setPriority(firebase.notifications.Android.Priority.High);
    
                  // Schedule the notification for 5 seconds in the future
          const date = new Date(notif.date);
          date.setSeconds(date.getSeconds() + 5);
          
          firebase.notifications()
            .scheduleNotification(localNotification, {
                fireDate: date.getTime(),
            })
            .catch(err => console.error(err));
          }
          else{
            const localNotification = new firebase.notifications.Notification({
              sound: 'default',
            // show_in_foreground: true,
            // show_in_background: true,
          })
              .setNotificationId('hh2')
              .setTitle('New Sleep Info')
              .setBody(notif.LiteralTitle)
              .setData({
                type: 'start',
            })
              .android.setChannelId('dep_time_tracing') // e.g. the id you chose above
              .android.setSmallIcon('ic_launcher') // create this icon in Android Studio
              .android.setPriority(firebase.notifications.Android.Priority.High);
    
              const date = new Date(notif.date);
    
              date.setSeconds(date.getSeconds() + 5);
              
              firebase.notifications()
                .scheduleNotification(localNotification, {
                    fireDate: date.getTime(),
                })
                .catch(err => console.error(err));
          }
            
        })  
        
      }

      createweeklyInfoNotifications(){

        const channel = new firebase.notifications.Android.Channel(
          'dep_time_tracing',
          'Time tracking',
          firebase.notifications.Android.Importance.Max
        ).setDescription('Hint users how much left time o drive to next dep');
        firebase.notifications().android.createChannel(channel);

        this.state.weeklyInfoNotifications.forEach(function(notif) {
         
          if(Platform.OS == 'android')
          {
            const localNotification = new firebase.notifications.Notification({
              sound: 'default',
            // show_in_foreground: true,
            // show_in_background: true,
          })
              .setNotificationId('hh2')
              .setTitle('New Sleep Info')
              .setBody(notif.FigurativeTitle)
              .setData({
                type: 'start',
                title: "Hello", 
                body: "World!" 
            })
              .android.setChannelId('dep_time_tracing') // e.g. the id you chose above
              .android.setSmallIcon('ic_launcher') // create this icon in Android Studio
              .android.setPriority(firebase.notifications.Android.Priority.High);
    
                  // Schedule the notification for 5 seconds in the future
          const date = new Date(notif.date);
          console.log("notif date is " + notif.date)
          date.setSeconds(date.getSeconds() + 5);
          
          firebase.notifications()
            .scheduleNotification(localNotification, {
                fireDate: date.getTime(),
            })
            .catch(err => console.error(err));
          }
          else{
            const localNotification = new firebase.notifications.Notification({
              sound: 'default',
            // show_in_foreground: true,
            // show_in_background: true,
          })
              .setNotificationId('hh2')
              .setTitle('New Sleep Info')
              .setBody(notif.LiteralTitle)
              .setData({
                type: 'start',
                title: "Hello", 
                body: "World!" 
            })
              .android.setChannelId('dep_time_tracing') // e.g. the id you chose above
              .android.setSmallIcon('ic_launcher') // create this icon in Android Studio
              .android.setPriority(firebase.notifications.Android.Priority.High);
    
              const date = new Date(notif.date);
    
              date.setSeconds(date.getSeconds() + 5);
              
              firebase.notifications()
                .scheduleNotification(localNotification, {
                    fireDate: date.getTime(),
                })
                .catch(err => console.error(err));
          }
            
        })
      }

      convertDateToUTC = (date) => { 
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
      }
    
      listenForInfoNotifications(notifRef) {
        notifRef.on('value', (snap) => {
          
          // get children as an array
          var entries = [];
          var keys = [];
          snap.forEach((child) => {
            child.forEach((item) => {
              var itemVal = item.val();
              keys.push(itemVal)
            })
    
            releaseDate = new Date(keys[0])
            releaseDate = this.convertDateToUTC(releaseDate)
            currentDate = new Date()
    
            if((releaseDate - currentDate) < 0)
            {
              entries.push({
                date: keys[0],
                FigurativeTitle: keys[2],
                LiteralTitle: keys[3]
              });
            }
            keys = []
    
          });
    
          entries.forEach((entry) => {
            console.log(entry)
          })
          
          this.setState({
            weeklyInfoNotifications: entries
          });
          console.log("weekly notificaton" + this.state.weeklyInfoNotifications)
          if(this.state.weeklyInfoNotifications != null)
          {
            
            this.createweeklyInfoNotifications();
          }

        });
    
      }
    
      listenForTipsNotifications(notifRef) {
        notifRef.on('value', (snap) => {
    
          // get children as an array
          var entries = [];
          var keys = [];
          snap.forEach((child) => {
            child.forEach((item) => {
              var itemVal = item.val();
              keys.push(itemVal)
            })
    
            releaseDate = new Date(keys[0])
            releaseDate = this.convertDateToUTC(releaseDate)
            currentDate = new Date()
    
            if((releaseDate - currentDate) < 0)
            {
              console.log(keys[0])
              entries.push({
                date: keys[0],
                FigurativeTitle: keys[2],
                LiteralTitle: keys[3]
              });
            }
            keys = []
    
          });
    
          entries.forEach((entry) => {
            console.log(entry)
          })
          
          this.setState({
            weeklyTipsNotifications: entries
          });
          
          if(this.state.weeklyTipsNotifications != null)
          {
            console.log("weekly notificaton")
            this.createWeeklyNotifications();
          }

        });
        

      }
      
    render(){
        return(
            <View>
                {/*We pass in an array of entry objects to a class named journalBoxList.
                    journalBoxList the entries one by one*/}
                {this.state.journal !== null ? <JournalBoxList data={this.state.journal} navigation={this.props.navigation}/> :  <ActivityIndicator style={{justifyContent: 'center', alignItems:'center'}} size="large" color="#000000" />}
            </View>
        )
    }
}

export default Journal