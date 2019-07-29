
import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { NavigationActions, StackActions} from 'react-navigation';
import * as firebase from 'firebase';
import SplashScreen from 'react-native-splash-screen'


export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        console.log("logging in")
        this.state = { 
            email: "",
            password: "",
        };
    }

    componentDidMount(){
        SplashScreen.hide();
    }
    onLoginPress = () => {
        console.log("logging in " + this.state.email)
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => { }, (error) => { Alert.alert(error.message); });
    }

    onCreateAccountPress = () => {
        const navActions = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: "SignupScreen"})]
        });
        this.props.navigation.dispatch(navActions);
    }

    onForgotPasswordPress = () => {
        var navActions = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: "Forgot"})]
        });
        this.props.navigation.dispatch(navActions);
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="position">
                <Image 
                    style={{width: 200, height: 200, alignSelf:'center'}}
                    source={require('../../assets/Icon/images/LoginIcon.png')}
                />

                <View style={{paddingTop:0, alignItems:"center"}}>
                    <Text style={{fontSize:50}}>Better Sleep</Text> 
                </View>

                <View style={{paddingTop:20, alignItems:"center"}}>


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
                    <Button style={styles.button} title="Login" onPress={this.onLoginPress} />
                    <View style={{paddingTop:10}} />
                    <Button style={styles.button} title="Create account..." onPress={this.onCreateAccountPress} />
                    <View style={{paddingTop:10}} />
                    <Button style={styles.button} title="Forgot Password..." onPress={this.onForgotPasswordPress} />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    button: Platform.select({
        ios: {},
        android: {
          elevation: 4,
          // Material design blue from https://material.google.com/style/color.html#color-color-palette
          backgroundColor: '#2196F3',
          borderRadius: 2,
          margin: 1
        },
      }),
});