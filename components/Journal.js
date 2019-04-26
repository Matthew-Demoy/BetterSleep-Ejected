import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native'
import {JournalBoxList} from './JournalBox'
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import * as firebase from 'firebase';

//Journal screen displays the current journal entries and has a button to submit more entries.
class Journal extends React.Component{


      constructor(props) {
        super(props);
        this.state = {
          journal : null
        };

        var user = firebase.auth().currentUser
        console.log("putting user info into db")
        userLocation = "users/" + user.uid + "/journals"
        console.log("going to " + userLocation)
        this.itemsRef = firebase.database().ref(userLocation).orderByChild('date');
        console.log("journal state is " + this.state.journal)
      }

      componentDidMount() {
        this.listenForItems(this.itemsRef)
      
      }

      listenForItems(itemsRef) {
        itemsRef.on('value', (snap) => {
    
          // get children as an array
          var entries = [];
          snap.forEach((child) => {
            entries.push({
              journal: child.val().text,
              didExercise: child.val().didExercise,
              didNutrition: child.val().didNutrition,
              grade: child.val().emotion,
              date: child.val().date,
              id: child.key
            });
          });
        
          entries.sort(function(a,b){
            return new Date(b.date) - new Date(a.date) })
    
          this.setState({
            journal: entries
          });
    
        });
      }
      

      getJournals = () => {

       let entries = []

        ref.on("value" , snapshot => {
          var entries = []
            snapshot.forEach(function(child){
                entries.push({
                  journal: child.text,
                  didExercise: child.exercise,
                  didNutrition: child.val().nutrition,
                  grade: child.val().emotion,
                  date: child.val().date,
                  id: child.val().date
              });
              return entries
            });
          })

        //this.props.data[0].journal
        return entries
      }
      
    render(){
        return(
            <View>
                {/*We pass in an array of entry objects to a function called metric card.
                    Metric card renders the entries one by one*/}
                {this.state.journal !== null ? <JournalBoxList data={this.state.journal} navigation={this.props.navigation}/> : <Text>Loading</Text> }
            </View>
        )
    }
}

Journal.propTypes = {
    entries: PropTypes.arrayOf(PropTypes.shape({
        journal: PropTypes.string.isRequired,
        didExercise: PropTypes.bool.isRequired,
        didNutrition: PropTypes.bool.isRequired,
        grade: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired
      })).isRequired
}

// mapStateToProps gets the current set of journal entries from the store and gives them to our Journal component
function mapStateToProps (state) {
  return {
    entries: state.entries
  }
}

const styles = StyleSheet.create({
    ScreenTitle: {
        color: 'white',
        fontSize : 25,
        
    },
    row: {
        //flexDirection: 'row',
        flex:2,
        justifyContent: 'center',
        alignItems: 'center',
        
      },
    EntryButton: {
        alignSelf:'flex-end',
    }
})

// The connect function tells journal to recieve props from the store
export default connect(mapStateToProps)(Journal)