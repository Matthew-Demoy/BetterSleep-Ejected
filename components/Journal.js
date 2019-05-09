import React from 'react'
import {View, ActivityIndicator} from 'react-native'
import {JournalBoxList} from './JournalBox'
import PropTypes from 'prop-types';
import * as firebase from 'firebase';

//Journal screen displays the current journal entries and has a button to submit more entries.
class Journal extends React.Component{

      constructor(props) {
        super(props);
        this.state = {
          journal : null
        };

        //get the user data from firebase
        var user = firebase.auth().currentUser
        userLocation = "users/" + user.uid + "/journals"
        this.itemsRef = firebase.database().ref(userLocation).orderByChild('date');
      }

      componentDidMount() {
        this.listenForItems(this.itemsRef)
        this._onBoardComplete()
      
      }

      _onBoardComplete = async () => {
        console.log("finishing onboarding ")
        try {
          await AsyncStorage.setItem('FIRSTTIME', 'false');
          
        } catch (error) {
          // Error saving data
        }
        console.log("onboarding finish")
      };

      //Firebase Listens for new items from the database to add to the journal state
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
                {/*We pass in an array of entry objects to a class named journalBoxList.
                    journalBoxList the entries one by one*/}
                {this.state.journal !== null ? <JournalBoxList data={this.state.journal} navigation={this.props.navigation}/> :  <ActivityIndicator style={{justifyContent: 'center', alignItems:'center'}} size="large" color="#000000" />}
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

export default Journal