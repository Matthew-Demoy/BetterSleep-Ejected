
import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, Image } from 'react-native';
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
            <View>
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

                    <Button title="Login" onPress={this.onLoginPress} />
                    <Button title="Create account..." onPress={this.onCreateAccountPress} />
                    <Button title="Forgot Password..." onPress={this.onForgotPasswordPress} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});