import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity, ActivityIndicator} from 'react-native'
import {CompleteDailyExercise} from '../actions/ActivityActions'
import {connect} from 'react-redux'
import Dialog from "react-native-dialog";
import * as firebase from 'firebase';
import {NewsBoxList} from './NewsBox'

class Information extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            dialogVisible: false,
            information: null
        }

        var user = firebase.auth().currentUser   
        console.log("putting user info into db")
        userLocation = "/SleepInformation"
        console.log("going to " + userLocation)
        this.itemsRef = firebase.database().ref(userLocation).orderByChild('date');
        console.log("journal state is " + this.state.journal)

    }
    
    completeExercise = () => {
        this.props.dispatch(CompleteDailyExercise())
        this.showDialog()
    }

    showDialog = () => {
        this.setState({ dialogVisible: true });
      };

      handleCancel = () => {
        this.setState({ dialogVisible: false });
      };

      componentDidMount() {
        this.listenForItems(this.itemsRef)
      
      }

      listenForItems(itemsRef) {
        itemsRef.on('value', (snap) => {
    
          // get children as an array
          var entries = [];
          var keys = [];
          snap.forEach((child) => {
            child.forEach((item) => {
              var itemVal = item.val();
              keys.push(itemVal)
            })
            
            console.log("key 0 " + keys[0])
            console.log("key 1 " + keys[1])
            console.log("key 2 " + keys[2])
            console.log("key 3 " + keys[3])

            releaseDate = new Date(keys[0])
            releaseDate = this.convertDateToUTC(releaseDate)
            currentDate = new Date()
            
            if((releaseDate - currentDate) < 0)
            {
              
              entries.push({
                Date: keys[0],
                Content: keys[1],
                FigurativeTitle: keys[2],
                LiteralTitle: keys[3]
              });
            }
            keys = []

          });

          this.setState({
            information: entries
          });
    
        });
      }

      convertDateToUTC = (date) => { 
        return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); 
    }

    render(){
        return(
            <View style = {styles.centerText}>

                <View style={{paddingTop:20}}></View>
                <Dialog.Container visible={this.state.dialogVisible} useNativeDriver={true}>
                    <Dialog.Title>Congrats Matt on completing your Exercise</Dialog.Title>
                    <Dialog.Description>
                        We added this info to your next journal entry
                    </Dialog.Description>
                    <Dialog.Button label="Ok" onPress={this.handleCancel} />
                </Dialog.Container>

                <View>
                    {this.state.information !== null ? <NewsBoxList data={this.state.information} navigation={this.props.navigation}/> :  <ActivityIndicator style={{justifyContent: 'center', alignItems:'center'}} size="large" color="#000000" /> }
                </View>
            </View>
        )
    }
}

styles = StyleSheet.create({
    centerText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default connect()(Information);