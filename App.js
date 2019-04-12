import React, {Component} from 'react';
import {createStore} from 'redux'
import { Provider } from 'react-redux';
import currentEntries from './reducers/Journal'
import JournalNav from './containers/JournalNav'
import * as firebase from 'firebase';

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
    };
    
    // Initialize firebase...
    if (!firebase.apps.length) { firebase.initializeApp(ApiKeys.FirebaseConfig); }
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  }

  onAuthStateChanged = (user) => {
    this.setState({isAuthenticationReady: true});
    this.setState({isAuthenticated: !!user});

    
  }

  render() {

      return (

          (this.state.isAuthenticated) ? 
          <Provider store={store}>
            <JournalNav /> 
          </Provider>: 
          <Provider store={store}>
            <RootNavigation />
          </Provider>
      );
      
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

