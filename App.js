import React, {Component} from 'react';
import {createStore} from 'redux'
import { Provider } from 'react-redux';
import currentEntries from './reducers/Journal'
import JournalNav from './containers/JournalNav'
import * as firebaseSDK from 'firebase';
import firebase from 'react-native-firebase';
import { Platform, StyleSheet, Text, View, Image, AsyncStorage } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from 'PushNotificationIOS'
import Onboarding from 'react-native-onboarding-swiper';
//import { AppLoading, Asset, Font } from 'expo';
//import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import ApiKeys from './constants/ApiKeys.js';

// Some default entries for what the the user would see when opening the app

state = {
  entries : [
      
    ],
    dailyExercise: false,
    dailyNutrition: false
}

//get uuid from auth CHECK
//use uuid for object ref CHECK
//update redux using ref GONNA NOT USE REDUX SORRY
//add object on signup  Done


// only grab journals in journal view
// only edit/add journals in newEntry (get journals passed as a prop) maybe bool if its new or edit
// this means taking reducer like functions into journal entry

// add entry
//edit entry on actions (should pass journalid as prop to journal entry )
//other screens need to pass info to journal entry

// Initialize Firebase

/* Creating a store(the internal state of the app) using the CurrentEntries Reducer(A function that tells how the store should be Update)
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
      firstTime: null
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

  async componentDidMount() {
    
    this.checkPermission();
    this.createNotificationListeners(); //add this line
  }

  componentWillUnmount() {
    this.notificationListener;
    this.notificationOpenedListener;
  }

  _retrieveFirstTime = async () => {
    console.log("getting first time info")
    
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
       alert('message');

      const localNotification = new firebase.notifications.Notification({
        sound: 'sampleaudio',
        show_in_foreground: true,
      })
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        // .setSubtitle(notification.subtitle)
        .setBody(notification.body)
        // .setData(notification.data)
        .android.setChannelId('fcm_default_channel') // e.g. the id you chose above
        .android.setSmallIcon('@drawable/ic_launcher') // create this icon in Android Studio
        .android.setColor('#000000') // you can set a color here
        .android.setPriority(firebaseSDK.notifications.Android.Priority.High);
        

      firebaseSDK.notifications()
        .displayNotification(localNotification)
        .catch(err => console.error(err));
          
    });
  
    const channel = new firebase.notifications.Android.Channel('fcm_default_channel', 'Demo app name', firebase.notifications.Android.Importance.High)
    .setDescription('Demo app description')
    .setSound('sampleaudio.mp3');
    firebase.notifications().android.createChannel(channel);

     /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      //console.log('onNotificationOpened:');
      //this.showAlert(title, body);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      console.log('getInitialNotification:');
      this.showAlert(title, body);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log("message is " + JSON.stringify(message));
    });
  }

  

    //3
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
          (this.state.isAuthenticated) ? 
          <Provider store={store}>
            <JournalNav /> 
          </Provider>: 
          <Provider store={store}>
            <RootNavigation />
          </Provider>
      );
      
    }


    
    cancelAll() {
      PushNotification.cancelAllLocalNotifications();
      PushNotificationIOS.cancelLocalNotifications();
    }

    /*
  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  */
}

