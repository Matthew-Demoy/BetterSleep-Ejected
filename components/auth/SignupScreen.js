
import React from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, Button, Alert, Picker } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';
import RNPickerSelect from 'react-native-picker-select';
import{genders, heights, martialStatus, children, habits} from '../Fields'

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
        const placeholder = {
            label: 'Select a sport...',
            value: null,
            color: '#9EA0A4',
          };
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
                            placeholder={{
                                label: 'Select Gender',
                                value: null,
                                color: '#9EA0A4',
                              }}
                            items={genders}
                            style={pickerSelectStyles}
                            useNativeAndroidPickerStyle={false}
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
                        placeholder={{
                            label: 'Select Height',
                            value: null,
                            color: '#9EA0A4',
                          }}
                        items={heights}
                        style={pickerSelectStyles}
                        useNativeAndroidPickerStyle={false}
                        onValueChange={value => {
                            this.setState({
                            height : value,
                            });
                        }}
                        value={this.state.height}
                    />
                </View>
                <View style={{alignItems:'center', paddingTop: 5}}>
                            
                </View>
                <Text style={{fontSize:25}}> Martial Status </Text>
                <View style={{alignItems:'center', paddingTop: 5}}>
                    <RNPickerSelect
                        placeholder={{
                            label: 'Martial Status.',
                            value: null,
                            color: '#9EA0A4',
                          }}
                        items={martialStatus}
                        useNativeAndroidPickerStyle={false}
                        style={pickerSelectStyles}
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
                        style={pickerSelectStyles}
                        placeholder={{
                            label: 'Select Children',
                            value: null,
                            color: '#9EA0A4',
                          }}
                        useNativeAndroidPickerStyle={false}
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
                        style={pickerSelectStyles}
                        placeholder={{
                            label: 'Select Sleep Habit',
                            value: null,
                            color: '#9EA0A4',
                          }}
                        useNativeAndroidPickerStyle={false}
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


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });

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