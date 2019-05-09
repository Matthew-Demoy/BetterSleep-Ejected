import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import JournalEntry from '../components/JournalEntry';
import Journal from '../components/Journal';
import Profile from '../components/Profile';
import Information from '../components/Information';
import Tips from '../components/Tips';
import UserSettings from '../components/UserSettings';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

  import { fromBottom } from 'react-navigation-transitions';
import {Text} from 'react-native'

const JournalNavigator = createStackNavigator(
    {
      Journal: {
          screen: Journal
      },
      Entry: {
          screen: JournalEntry
      },
    },
    {
      transitionConfig: () => fromBottom(),
      defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#27A8E6',
            elevation: 0,
            shadowOpacity: 0
        },
        headerTitle: <Text style={{color: 'white',fontSize : 25,}}> Journal </Text>,
        headerTintColor: '#27A8E6',
        headerTitleStyle: {
            fontWeight: 'bold',
            color: '#ffffff'
        }
      }
    }
);

JournalNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
      tabBarVisible,
  };
};
  
const InformationNavigator = createStackNavigator(
  {
    Information: {
        screen: Information
    },
    Entry: {
        screen: JournalEntry
    },
  },
  {
    transitionConfig: () => fromBottom(),
    defaultNavigationOptions: {
      headerStyle: {
          backgroundColor: '#27A8E6',
          elevation: 0,
          shadowOpacity: 0
      },
      headerTitle: <Text style={{color: 'white',fontSize : 25,}}> Sleep Information </Text>,
      headerTintColor: '#27A8E6',
      headerTitleStyle: {
          fontWeight: 'bold',
          color: '#ffffff'
      }
    }
  }
);

InformationNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
      tabBarVisible,
  };
};

const TipsNavigator = createStackNavigator(
  {
    Tips: {
        screen: Tips
    },
    Entry: {
        screen: JournalEntry
    },
  },
  {
    transitionConfig: () => fromBottom(),
    defaultNavigationOptions: {
      headerStyle: {
          backgroundColor: '#27A8E6',
          elevation: 0,
          shadowOpacity: 0
      },
      headerTitle: <Text style={{color: 'white',fontSize : 25,}}> Sleep Tips </Text>,
      headerTintColor: '#27A8E6',
      headerTitleStyle: {
          fontWeight: 'bold',
          color: '#ffffff'
      }
    }
  }
);

TipsNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
      tabBarVisible,
  };
};

const ProfileNavigator = createStackNavigator(
  {
    Profile: {
        screen: Profile
    },
    Entry: {
        screen: JournalEntry
    },
    Settings: {
      screen: UserSettings
    }
  },
  {
    transitionConfig: () => fromBottom(),
    defaultNavigationOptions: {
      headerStyle: {
          backgroundColor: '#27A8E6',
          elevation: 0,
          shadowOpacity: 0
      },
      headerTitle: <Text style={{color: 'white',fontSize : 25,}}> Profile </Text>,
      headerTintColor: '#27A8E6',
      headerTitleStyle: {
          fontWeight: 'bold',
          color: '#ffffff'
      }
    }
  }
);

ProfileNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
      tabBarVisible,
  };
};

  const AppNavigator = createBottomTabNavigator({

    Information :{
      screen: InformationNavigator,
      navigationOptions: {
        tabBarLabel: 'Information',
        tabBarIcon: ({ tintColor }) => (
          <Entypo name="news" size={40}/>
        )
      },
    },
    Nutrition :{
      screen: TipsNavigator,
      navigationOptions: {
        tabBarLabel: 'Tips',
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="directions-run" size={40}/>
        )
      },
    },
     Entry:{
      screen: JournalEntry,
      navigationOptions: {
        tabBarLabel:<Text/>,
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="pencil-square-o" size={40}/>
        )
      },
     },
    Journal: {
        screen: JournalNavigator,
        navigationOptions: {
          tabBarLabel:"Journal",
          tabBarIcon: ({ tintColor }) => (
            <Ionicons name="ios-bookmarks" size={40}/>
          )
        },
    },
    Profile: {
        screen: ProfileNavigator,
        navigationOptions: {
          tabBarLabel: 'Profile',
          tabBarIcon: ({ tintColor }) => (
            <MaterialIcons name="person" size={40}/>
          )
        },
    }
    },{
      
      initialRouteName : 'Journal',

      tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
    }
  );

export default createAppContainer(AppNavigator)


