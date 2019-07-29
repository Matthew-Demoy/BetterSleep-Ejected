import React from 'react'
import {Calendar} from 'react-native-calendars' 
import {connect} from 'react-redux'
import * as firebase from 'firebase';

//get entry dates in array from state
//create function from array to list of objects
//attach list  to marked

class StreakCalendar extends React.Component{
    
    constructor(props){
        super(props);
        entries = this.props.entries
        this.state = {
            marked: null,
            nextDay:entries,
            journal : {}
        };

        var user = firebase.auth().currentUser
        var database = firebase.database();
    
        console.log("putting user info into db")
        userLocation = "users/" + user.uid + "/journals"
        console.log("going to " + userLocation)
        this.itemsRef = firebase.database().ref(userLocation).orderByChild('date');
        console.log("journal state is " + this.state.journal)
    }
    componentDidMount() {
        this.anotherFunc();
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
          console.log("snap " + child.val().didExercise,)
        });
      
        entries.sort(function(a,b){
          console.log("sort")
          console.log(b.date)
          console.log(a.date)
          return new Date(b.date) - new Date(a.date) })
  
        this.setState({
          journal: entries
        });
  
      });
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.state.nextDay !== this.props.entries) {
        console.log("updating calender state")
        this.setState({nextDay : this.props.entries})
      }
    }
    
    anotherFunc = () => {

      dates = []
      console.log("mapping calendar")
      result = Object.values(this.state.journal);
      result.forEach( function(entry) {
        {
          if(entry.date !== undefined)
            {
                dates.push(entry.date)
            }
        }
        
      });
      var obj = dates.reduce((c, v) => Object.assign(c, {[v]: {selected: true,marked: true, color: '#27A8E6'}}), {});
      return obj
    }

    render(){
      var markedDates= this.anotherFunc()
       
        return(
          <Calendar
          // Collection of dates that have to be colored in a special way. Default = {}
           markedDates= {markedDates}
          // Date marking style [simple/period/multi-dot/custom]. Default = 'simple'
          markingType={'period'}
          style={{
            borderWidth: 1,
            borderColor: 'gray',
            height: 350,
            marginHorizontal: 5,
            borderRadius:10,
          }}
        />
        )
    }

    getdates = (entries) => {
      dates = {}
      dates = dates.push(entries[0])

    }
}

export default StreakCalendar