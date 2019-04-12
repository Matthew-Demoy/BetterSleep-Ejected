import React from 'react';
import { createStackNavigator,createAppContainer, createSwitchNavigator } from 'react-navigation';

import JournalNav from '../containers/JournalNav';
import LoginScreen from '../components/auth/LoginScreen';
import SignupScreen from '../components/auth/SignupScreen';
import ForgotPasswordScreen from '../components/auth/ForgotPasswordScreen';


const IntroStack = createStackNavigator(
  {
  Login:LoginScreen,
  SignupScreen: SignupScreen,
  Forgot:  ForgotPasswordScreen,
  },

  );


const MainStack = createSwitchNavigator({
  intro:{screen:IntroStack},
  main: {screen: JournalNav}

});



const App = createAppContainer(MainStack);


export default class RootNavigator extends React.Component {


  render() {
    return <App />;
  }

}


