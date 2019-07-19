import React, {Component} from 'react';
import {createStore} from 'redux'
import { Provider } from 'react-redux';
import currentEntries from './reducers/Journal'
import JournalNav from './containers/JournalNav'
import * as firebaseSDK from 'firebase';
import firebase from 'react-native-firebase';
import { Image, AsyncStorage, DeviceEventEmitter,Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationAndroid from 'react-native-push-notification';
import PushNotificationIOS from 'PushNotificationIOS'
import Onboarding from 'react-native-onboarding-swiper';
import RootNavigation from './navigation/RootNavigation';
import ApiKeys from './constants/ApiKeys.js';

state = {

    dailyExercise: false,
    dailyNutrition: false
}



// Initialize Firebase

/* Creating a store(the internal state of the app) using the CurrentEntries Reducer(A function that tells how the store should be Updated)
  and the default entries listed above. Refer to redux documentation to learn more about the store 
*/

store = createStore(currentEntries,state)

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      isAuthenticationReady: false,
      isAuthenticated: false,
      // firstTime detects if a user should go through userO nboarding 
      firstTime: null,
      inputSleep: false,
    };
    
    // Initialize firebase...
    if (!firebaseSDK.apps.length) { firebaseSDK.initializeApp(ApiKeys.FirebaseConfig); }
    firebaseSDK.auth().onAuthStateChanged(this.onAuthStateChanged);
    this._retrieveFirstTime()
    

  }

  

  onAuthStateChanged = (user) => {
    this.setState({isAuthenticationReady: true});
    this.setState({isAuthenticated: !!user});

  }


 componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners();

  }


  componentWillMount(){
    //This function should detect when a user clicks on a daily notification and open a window
    /*
    (function() {
      // Register all the valid actions for notifications here and add the action handler for each action
      PushNotificationAndroid.registerNotificationActions(['Accept','Reject']);
      DeviceEventEmitter.addListener('notificationActionReceived', function(action){
        console.log ('Notification action received: ' + action);
        const info = JSON.parse(action.dataJSON);
        console.log("info action is " + info.action)
        if (info.action == 'Accept') {
          console.log("accept notification reminder")
          this.setState({inputSleep:true})
        } else if (info.action == 'Reject') {
          // Do work pertaining to Reject action here
        }
      });
    })();
      */
  }



  componentWillUnmount() {
    this.notificationListener;
    this.notificationOpenedListener;
  }

  //detect if it is users first time on the app
  _retrieveFirstTime = async () => {
    
    try {
      const value = await AsyncStorage.getItem('FIRSTTIME');
      if (value === 'false') {
        // We have data!!
        console.log("retrieved async firstime" + value)
        this.setState({firstTime: 'false'})
      }
      else {
        this.setState({firstTime: 'true'})
        console.log("new user")
      }
    } catch (error) {
      // Error retrieving data
    }

    try {
      await AsyncStorage.setItem('FIRSTTIME', 'false');
      
    } catch (error) {
      // Error saving data
    }
  }

  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    this.setState({ firstTime: false });
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
      console.log("token is " + this.getToken())
    } else {
      this.requestPermission();
    }
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      console.log('onNotification:');
      
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

    async getToken() {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
          // user has a device token
          console.log('fcmToken:', fcmToken);
          await AsyncStorage.setItem('fcmToken', fcmToken);
        }
      }
      console.log('fcmToken:', fcmToken);
    }
  
    //2
    async requestPermission() {
      try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
      } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
      }
    }


  render() {

      return (
        //Render onBoarding if first time
        (this.state.firstTime === 'true') ?
        <Onboarding
        onDone = {this._onDone}
        pages={[
          {
            backgroundColor: '#fff',
            image: <Image source={require('./assets/images/appicon.png')} />,
            title: 'Welcome to Better Sleep',
            subtitle: 'Here is a quick guide to use the app',
          },
          {
            backgroundColor: '#fe6e58',
            image: <Image source={require('./assets/images/Tabs.png')} />,
            title: 'Learn',
            subtitle: 'Use the Nutrition and Exercise Tab to Get the Latest and Greatest Sleep Information',
          },
          {
            backgroundColor: '#999',
            image: <Image source={require('./assets/images/calendar.png')} />,
            title: 'Act',
            subtitle: "Apply these tips to your sleep routine",
          },
          {
            backgroundColor: '#999',
            image: <Image source={require('./assets/images/journal.png')} />,
            title: 'Track',
            subtitle: "Track your sleep in your own journal and watch your sleep improve day by day!",
          },
          
        ]}
      />:
          (this.state.inputSleep) ?
            <Button
              onPress={this.setState({inputSleep:false})}
              title="Learn More"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />:
            (this.state.isAuthenticated) ? 
            //If user is authenticated go to journal otherwise go to login screen
            <Provider store={store}>
              <JournalNav /> 
            </Provider>: 
            <Provider store={store}>
              <RootNavigation />
            </Provider>
      );
      
    }
    //Cancel all active notications
    cancelAll() {
      PushNotification.cancelAllLocalNotifications();
      PushNotificationIOS.cancelLocalNotifications();
    }
}

