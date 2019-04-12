import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import React from 'react';
import JournalEntry from '../components/JournalEntry';
import Journal from '../components/Journal';
import Profile from '../components/Profile';
import Exercise from '../components/Exercise';
import Nutrition from '../components/Nutrition';
import UserSettings from '../components/UserSettings';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

  import { fromBottom } from 'react-navigation-transitions';
import {Text, Image} from 'react-native'

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
  
const ExerciseNavigator = createStackNavigator(
  {
    Exercise: {
        screen: Exercise
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
      headerTitle: <Text style={{color: 'white',fontSize : 25,}}> Exercise Tips </Text>,
      headerTintColor: '#27A8E6',
      headerTitleStyle: {
          fontWeight: 'bold',
          color: '#ffffff'
      }
    }
  }
);

ExerciseNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
      tabBarVisible,
  };
};

const NutritionNavigator = createStackNavigator(
  {
    Nutrition: {
        screen: Nutrition
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
      headerTitle: <Text style={{color: 'white',fontSize : 25,}}> Nutrition Tips </Text>,
      headerTintColor: '#27A8E6',
      headerTitleStyle: {
          fontWeight: 'bold',
          color: '#ffffff'
      }
    }
  }
);

NutritionNavigator.navigationOptions = ({ navigation }) => {
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

    Exercise :{
      screen: ExerciseNavigator,
      navigationOptions: {
        tabBarLabel: 'Exercise',
        tabBarIcon: ({ tintColor }) => (
          <MaterialIcons name="directions-run" size={40}/>
        )
      },
    },
    Nutrition :{
      screen: NutritionNavigator,
      navigationOptions: {
        tabBarLabel: 'Nutrition',
        tabBarIcon: ({ tintColor }) => (
          <MaterialCommunityIcons name="food-fork-drink" size={40}/>
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


