import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Button, TextInput } from 'react-native';
import * as firebase from 'firebase';
import RNPickerSelect from 'react-native-picker-select';
import Dialog from "react-native-dialog";

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

            <Dialog.Container visible={this.state.dialogVisible} useNativeDriver={true}>
                <Dialog.Title>Change Name</Dialog.Title>
                <Dialog.Description>
                    Do you want to change your profile name?
                </Dialog.Description>
                <Dialog.Input 
                    onChangeText={(text) => this.setState({nameInput:text})} value={this.state.nameInput}
                />
                <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                <Dialog.Button label="Change" onPress={this.handleChange} />
            </Dialog.Container>

            <View style={styles.spacedrow}>
                <Text>Gender</Text>
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

            <View style={styles.spacedrow}>
                <Text> Height </Text>
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

            <View style={styles.spacedrow}>
                <Text>Children</Text>
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
            
            <View style={styles.spacedrow}>
                <Text>Sleep Habit</Text>
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

            <Button title="Submit Settings" onPress={this.onSettingsChange} />
            <Button title="Cancel Changes" onPress={this.onBackToProfilePress} />
            <Text style={{alignSelf:"center"}}>For customer support email umlproject48@gmail.com</Text>
        </View>
        )
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