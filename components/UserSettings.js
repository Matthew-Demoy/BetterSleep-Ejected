import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Button, TextInput } from 'react-native';
import * as firebase from 'firebase';
import RNPickerSelect from 'react-native-picker-select';
import Dialog from "react-native-dialog";
import{genders, heights, martialStatus, children, habits} from './Fields'

export default class UserSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            gender: "m",
            weight: 165,
            age: 22,
            height:68,
            children: 0,
            martialStatus: "Single",
            habit: "late",
            dialogVisible: false,
            username:"PlaceHolder1",
            name:"Matt Demoy",
            nameInput: "",
            dialogVisible: false
        };

        var user = firebase.auth().currentUser

        console.log("putting user info into db")
        userLocation = "users/" + user.uid
        console.log("going to " + userLocation)
        this.itemsRef = firebase.database().ref(userLocation)
        console.log("journal state is " + this.itemsRef)
    }

    componentDidMount() {
        this.listenForItems(this.itemsRef)
      }

      listenForItems(itemsRef) {
        itemsRef.on('value', (snap) => {

            this.setState({
                gender: snap.val().gender,
                weight: snap.val().weight,
                age: snap.val().age,
                height: snap.val().height,
                children: snap.val().children,
                martialStatus: snap.val().martialStatus,
                habit: snap.val().habit,
                name: snap.val().name
          });
        });
      }

    showDialog = () => {
        this.setState({ dialogVisible: true });
      };

      handleCancel = () => {
        this.setState({ dialogVisible: false , nameInput:''});
      };
      
      handleChange = () => {
        changedName = this.state.nameInput
        this.setState({ dialogVisible: false, name: changedName, nameInput:'' });
      };

    
    onSettingsChange = () => {
        // only update chart if the data has changed

        this.itemsRef.update({
            gender: this.state.gender,
            weight: this.state.weight,
            age: this.state.age,
            height: this.state.height,
            children: this.state.children,
            martialStatus: this.state.martialStatus,
            habit: this.state.habit,
            name: this.state.name

        })
        
        this.props.navigation.pop()
        this.props.navigation.navigate('Profile')
    }

    onBackToProfilePress = () => {
        this.props.navigation.pop()
        this.props.navigation.navigate('Profile')
    }

    render(){
        return(
        <View>
            <TouchableOpacity style={styles.button} onPress={this.showDialog}>
                <View style={styles.spacedrow}>
                    <Text style={[{paddingLeft:10},styles.accountText]}>Name</Text>
                    <Text style={[{paddingRight:10}, {color:'#0000FF'},styles.accountText]}>{this.state.name}</Text>
                </View>
            </TouchableOpacity>

            <Dialog.Container visible={this.state.dialogVisible}>
                <Dialog.Title>Change Name</Dialog.Title>
                <Dialog.Description>
                    Do you want to change your profile name?
                </Dialog.Description>
                <Dialog.Input 
                    onChangeText={(text) => this.setState({nameInput:text})} value={this.state.nameInput} placeholder={"Enter Name"} style={{borderWidth:1}}
                />
                <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                <Dialog.Button label="Change" onPress={this.handleChange} />
            </Dialog.Container>

            <View style={styles.spacedrow}>
                <Text>Gender</Text>
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
            </View>

            <View style={styles.spacedrow}>
                <Text> Height </Text>
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
            
            <View style={styles.spacedrow}>
                <Text>Weight</Text>
                <TextInput style={{width: 200, height: 40, borderWidth: 1}}
                        value={this.state.weight}
                        onChangeText={(text) => { this.setState({weight: Number(text)}) }}
                        placeholder="Weight(lbs)"
                        secureTextEntry={false}
                        keyboardType = 'numeric'
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
            </View>
            <View style={styles.spacedrow}>
                <Text> Martial Status </Text>
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

            <View style={styles.spacedrow}>
                <Text>Children</Text>
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
            
            <View style={styles.spacedrow}>
                <Text>Sleep Habit</Text>
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

            <Button title="Submit Settings" onPress={this.onSettingsChange} />
            <View style={{paddingTop:10}} />
            <Button title="Cancel Changes" onPress={this.onBackToProfilePress} />
            <Text style={{alignSelf:"center"}}>For customer support email umlproject48@gmail.com</Text>
        </View>
        )
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
    button : {
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        marginTop : 10,
    },
    spacedrow: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight:5,
    },
    row: {
        flexDirection: 'row',
        paddingTop: 15,
        paddingBottom: 15,
    },
    accountText : {
        fontSize: 15,
    },
    ScreenTitle: {
        color: 'white',
        fontSize : 25,  
    },

})