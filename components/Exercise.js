import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import {CompleteDailyExercise} from '../actions/ActivityActions'
import {connect} from 'react-redux'
import Dialog from "react-native-dialog";
import * as firebase from 'firebase';
import {NewsBoxList} from './NewsBox'

class Exercise extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            dialogVisible: false,
            news: null
        }

        var user = firebase.auth().currentUser   
        console.log("putting user info into db")
        userLocation = "/ExerciseTips"
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
          snap.forEach((child) => {
            entries.push({
              Title: child.val().Title,
              Description: child.val().Description,
            });
            console.log("snap " + child.val().didExercise,)
          });

          this.setState({
            news: entries
          });
    
        });
      }

    render(){
        return(
            <View style = {styles.centerText}>

                <View style={{paddingTop:20}}></View>
                <TouchableOpacity onPress={this.completeExercise}>
                    <Text style={{fontSize:20}}>Press to complete daily Exercise!</Text>
                </TouchableOpacity>
                <Dialog.Container visible={this.state.dialogVisible} useNativeDriver={true}>
                    <Dialog.Title>Congrats Matt on completing your Exercise</Dialog.Title>
                    <Dialog.Description>
                        We added this info to your next journal entry
                    </Dialog.Description>
                    <Dialog.Button label="Ok" onPress={this.handleCancel} />
                </Dialog.Container>

                <View>
                    {this.state.news !== null ? <NewsBoxList data={this.state.news} navigation={this.props.navigation}/> :<Text>Loading</Text> }
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

export default connect()(Exercise);