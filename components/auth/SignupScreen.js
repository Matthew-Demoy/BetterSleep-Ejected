
import React from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Button, Alert, Picker } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';
import RNPickerSelect from 'react-native-picker-select';

export default class SignupScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            email: "",
            password: "",
            passwordConfirm: "",
            gender: "m",
            weight: 165,
            age: 22,
            height:68,
            children: 0,
            martialStatus: "Single",
            habit: "late",
        };


    }

    onSignupPress = () => {
        if (this.state.password !== this.state.passwordConfirm) {
            Alert.alert("Passwords do not match");
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => { }, (error) => { Alert.alert(error.message); });
    }

    componentWillUnmount = () => {
        
        var user = firebase.auth().currentUser
        var database = firebase.database();

        if (user != null) {
            console.log("putting user info into db")
            userLocation = "users/" + user.uid
            console.log("going to " + userLocation)
            var ref = database.ref(userLocation);
            ref.set({
                "email": this.state.email, 
                "gender": this.state.gender,
                "height": this.state.height,
                "weight": this.state.weight,
                "age": this.state.age,
                "martialStatus": this.state.martialStatus,
                "children": this.state.children,
                "habit": this.state.habit,
                "journals": []
            });
        }

    }

    onBackToLoginPress = () => {
        var navActions = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: "Login"})]
        });
        this.props.navigation.dispatch(navActions);
    }

    onMalePress = () => {
        this.setState({gender: 'm'})
    }

    onFemalePress = () => {
        this.setState({gender: 'f'})
    }

    render() {
        return (
            <ScrollView>
            <View style={{paddingTop:20, alignItems:"center"}}>
            
                <View style={{paddingBotom:30, alignItems:"center"}}>
                    <Text style={{fontSize:30}}>Create Account</Text> 
                </View>
                
                <TextInput style={{width: 200, height: 40, borderWidth: 1}}
                    value={this.state.email}
                    onChangeText={(text) => { this.setState({email: text}) }}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <View style={{paddingTop:10}} />

                <TextInput style={{width: 200, height: 40, borderWidth: 1}}
                    value={this.state.password}
                    onChangeText={(text) => { this.setState({password: text}) }}
                    placeholder="Password"
                    secureTextEntry={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <View style={{paddingTop:10}} />

                <TextInput style={{width: 200, height: 40, borderWidth: 1}}
                    value={this.state.passwordConfirm}
                    onChangeText={(text) => { this.setState({passwordConfirm: text}) }}
                    placeholder="Password (confirm)"
                    secureTextEntry={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <View style={{paddingTop:10}} />

                <TextInput style={{width: 200, height: 40, borderWidth: 1}}
                    value={this.state.weight}
                    onChangeText={(text) => { this.setState({weight: Number(text)}) }}
                    placeholder="Weight(lbs)"
                    secureTextEntry={false}
                    keyboardType = 'numeric'
                    autoCapitalize="none"
                    autoCorrect={false}
                />

                <View style={{paddingTop:10}} />

                    <TextInput style={{width: 200, height: 40, borderWidth: 1}}
                        value={this.state.age}
                        onChangeText={(text) => { this.setState({weight: Number(text)}) }}
                        placeholder="Age"
                        secureTextEntry={false}
                        keyboardType = 'numeric'
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
      

                    <Text style={{fontSize:25}}>Gender</Text>
                    <View style={{alignItems:'center', paddingTop: 5}}>
                        <RNPickerSelect
                            placeholder={{}}
                            items={genders}
                            onValueChange={value => {
                                this.setState({
                                gender: value,
                                });
                            }}
                            value={this.state.gender}
                        />
                    </View>
                <View style={{paddingTop:10}} />

                <Text style={{fontSize:25}}> Height </Text>
                <View style={{alignItems:'center', paddingTop: 5}}>
                    <RNPickerSelect
                        placeholder={{}}
                        items={heights}
                        onValueChange={value => {
                            this.setState({
                            height : value,
                            });
                        }}
                        value={this.state.height}
                    />
                </View>

                <Text style={{fontSize:25}}> Martial Status </Text>
                <View style={{alignItems:'center', paddingTop: 5}}>
                    <RNPickerSelect
                        placeholder={{}}
                        items={martialStatus}
                        onValueChange={value => {
                            this.setState({
                            martialStatus: value,
                            });
                        }}
                        value={this.state.martialStatus}
                    />
                </View>

                <Text style={{fontSize:25}}>Children</Text>
                <View style={{alignItems:'center', paddingTop: 5}}>
                    <RNPickerSelect
                        placeholder={{}}
                        items={children}
                        onValueChange={value => {
                            this.setState({
                            children: value,
                            });
                        }}
                        value={this.state.children}
                    />
                </View>

                <Text style={{fontSize:20}}>What best describes your sleep habits?</Text>
                <View style={{alignItems:'center', paddingTop: 5}}>
                    <RNPickerSelect
                        placeholder={{}}
                        items={habits}
                        onValueChange={value => {
                            this.setState({
                            habit: value,
                            });
                        }}
                        value={this.state.habit}
                    />
                </View>
                        
                <View style={{paddingTop:15}} />
                <Button title="Signup" onPress={this.onSignupPress} />

                <Button title="Back to Login" onPress={this.onBackToLoginPress} />
            </View>
            </ScrollView>
        );
    }
}

const genders = [
    {
        label: "Female",
        value: "f"
    },
    {
        label: "Male",
        value: "m"
    }
]

const heights = [
    {
      label: '4 \' 0\'\'',
      value: 48,
    },
    {
        label: '4 \' 1\'\'',
        value: 49,
    },
    {
        label: '4 \' 2\'\'',
        value: 50,
    },
    {
        label: '4 \' 3\'\'',
        value: 51,
    },
    {
        label: '4 \' 4\'\'',
        value: 52,
    },
    {
        label: '4 \' 5\'\'',
        value: 53,
    },
    {
        label: '4 \' 6\'\'',
        value: 54,
      },
      {
          label: '4 \' 7\'\'',
          value: 55,
      },
      {
          label: '4 \' 8\'\'',
          value: 56,
      },
      {
          label: '4 \' 9\'\'',
          value: 57,
      },
      {
          label: '4 \' 10\'\'',
          value: 58,
      },
      {
          label: '4 \' 11\'\'',
          value: 59,
      },
      {
        label: '5 \' 0\'\'',
        value: 60,
      },
      {
          label: '5 \' 1\'\'',
          value: 61,
      },
      {
          label: '5 \' 2\'\'',
          value: 62,
      },
      {
          label: '5 \' 3\'\'',
          value: 63,
      },
      {
          label: '5 \' 4\'\'',
          value: 64,
      },
      {
          label: '5 \' 5\'\'',
          value: 65,
      },
      {
          label: '5 \' 6\'\'',
          value: 66,
        },
        {
            label: '5 \' 7\'\'',
            value: 67,
        },
        {
            label: '5 \' 8\'\'',
            value: 68,
        },
        {
            label: '5 \' 9\'\'',
            value: 69,
        },
        {
            label: '5 \' 10\'\'',
            value: 70,
        },
        {
            label: '5 \' 11\'\'',
            value: 71,
        },
        {
            label: '6 \' 0\'\'',
            value: 72,
          },
          {
              label: '6 \' 1\'\'',
              value: 73,
          },
          {
              label: '6 \' 2\'\'',
              value: 74,
          },
          {
              label: '6 \' 3\'\'',
              value: 75,
          },
          {
              label: '6 \' 4\'\'',
              value: 76,
          },
          {
              label: '6 \' 5\'\'',
              value: 77,
          },
          {
              label: '6 \' 6\'\'',
              value: 78,
            },
            {
                label: '6 \' 7\'\'',
                value: 79,
            },
            {
                label: '6 \' 8\'\'',
                value: 80,
            },
            {
                label: '6 \' 9\'\'',
                value: 81,
            },
            {
                label: '6 \' 10\'\'',
                value: 82,
            },
            {
                label: '6 \' 11\'\'',
                value: 83,
            },
            {
              label: '7 \' 0\'\'',
              value: 84,
            },
            {
                label: '7 \' 1\'\'',
                value: 85,
            },
            {
                label: '7 \' 2\'\'',
                value: 86,
            },
            {
                label: '7 \' 3\'\'',
                value: 87,
            },
            {
                label: '7 \' 4\'\'',
                value: 88,
            },
            {
                label: '7 \' 5\'\'',
                value: 89,
            },
            {
                label: '7 \' 6\'\'',
                value: 90,
              },
              {
                  label: '7 \' 7\'\'',
                  value: 91,
              },
              {
                  label: '7 \' 8\'\'',
                  value: 92,
              },
              {
                  label: '7 \' 9\'\'',
                  value: 93,
              },
              {
                  label: '7 \' 10\'\'',
                  value: 94,
              },
              {
                  label: '7 \' 11\'\'',
                  value: 95,
              },

  ];

const martialStatus = [
    {
      label: 'Single',
      value: 'single',
    },
    {
      label: 'Married',
      value: 'married',
    },
    {
      label: 'Seperated',
      value: 'seperated',
    },
  ];

const children = [
    {
        label: "None",
        value: 0,
      },
    {
      label: '1',
      value: 1,
    },
    {
      label: '2',
      value: 2,
    },
    {
      label: '3',
      value: 3,
    },
    {
        label: '4+',
        value: 4,
      },
  ];

  const habits = [
    {
        label: "My sleep is fine",
        value: 0,
      },
    {
      label: "I stay up too late",
      value: 1,
    },
    {
      label: "I have trouble staying asleep",
      value: 2,
    },
    {
      label: "I get woken up by family members",
      value: 3,
    },
  ];

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',

      },
      spacedrow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight:5,
    },
});