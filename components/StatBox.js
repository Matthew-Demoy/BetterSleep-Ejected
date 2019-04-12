import React from 'react'
import {connect} from 'react-redux'
import {Text, View, StyleSheet} from 'react-native'
import * as firebase from 'firebase';

//longest streak
//current streak
//days logged
//exercises completed
//days with good nutrition

class StatBox extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            currentStreak : 0,
            longestStreak : 0,
            journal: {},
        };

        var user = firebase.auth().currentUser
    
        console.log("putting user info into db")
        userLocation = "users/" + user.uid + "/journals"
        console.log("going to " + userLocation)
        this.itemsRef = firebase.database().ref(userLocation).orderByChild('date');


    }

    componentDidMount() {
        this.listenForItems(this.itemsRef)
      
      }

      listenForItems(itemsRef) {
        itemsRef.on('value', (snap) => {
    
          // get children as an array
          var entries = [[]];
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

    getExercisesCompleted = () => {
        result = Object.values(this.state.journal);
        console.log("exr " + result)
        const sum = result.reduce((acc, currentvalue) => {
            if(currentvalue.didExercise === true)
            {
                acc = acc + 1
            }
            return acc
        }, 0)
        return parseInt(sum)
    }

    getNutritionCompleted = () => {
        result = Object.values(this.state.journal);
        const sum = result.reduce((acc, currentvalue) => {
            if(currentvalue.didNutrition === true)
            {
                acc = acc + 1
            }
            return acc
        }, 0)
        return parseInt(sum)
    }

    getCurrentStreak = () => {
        dates = []
        result = Object.values(this.state.journal);
        console.log("streak " + result)
        result.forEach( function(entry) {
            if(entry.date !== undefined)
            {
                dates.push(entry.date)
            }
            
        });
        dateObs = []
        console.log(dates)
        dates.forEach( function(date) {
            var mdy = date.split('-');
            dateObs.push(new Date(mdy[0], mdy[1]-1, mdy[2]))
        });

        currentStreak = 0
        streak = 0
        currentStreakFound = false
        today = new Date()

        
        for (i = 0; i < dateObs.length - 1; i++)
        {
            console.log("calendar " + this.datediff(dateObs[i] , dateObs[i+1]))

            if(this.datediff(dateObs[i] , dateObs[i+1]) <= 1)
            {
                streak = streak + 1
                console.log("streak " + streak)
            }
            else
            {
                if ( currentStreakFound == false)
                {
                    currentStreakFound = true
                    console.log("found " + this.datediff(today, dateObs[0]))
                    if(this.datediff(today, dateObs[0]) == 0 || (this.datediff(today,dateObs[0]) == 1))
                    {
                        currentStreak = streak
                    }
                    else
                    {
                        currentStreak = streak - 1
                    }
                    
                }
            }
            
            
        }

        return currentStreak + 1
    }

    getLongestStreak = () => {
        dates = []
        result = Object.values(this.state.journal);
        result.forEach( function(entry) {
            dates.push(entry.date)
        });
        console.log("getting streaks")
        dateObs = []

        dates.forEach( function(date) {
                if(date !== undefined)
                {
                    var mdy = date.split('-');
                    dateObs.push(new Date(mdy[0], mdy[1]-1, mdy[2]))
                }
        });

        longestStreak = 0
        streak = 0
        
        for (i = 0; i < dateObs.length - 1; i++)
        {
            //console.log(this.datediff(dateObs[i] , dateObs[i+1]))
            //console.log(streak)
            if(this.datediff(dateObs[i] , dateObs[i+1]) == 1)
            {
                streak = streak + 1
            }
            else
            {
                if( streak > longestStreak)
                {
                    longestStreak = streak
                }
                streak = 0
            }
        }
        if( streak > longestStreak)
        {
            longestStreak = streak
        }

        return longestStreak + 1
    }
    
    datediff = (first, second) => {
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        const utc1 = Date.UTC(first.getFullYear(), first.getMonth(), first.getDate());
        const utc2 = Date.UTC(second.getFullYear(), second.getMonth(), second.getDate());

        return Math.round((utc1 - utc2)/(1000*60*60*24));
    }

    
    render(){
       
        return(
          <View>
              <Text style={styles.generic}>Days Logged: {this.state.journal.length}</Text>
              <Text style={styles.generic}>Exercises completed: {this.getExercisesCompleted()} </Text>
              <Text style={styles.generic}>Nutrition Logged: {this.getNutritionCompleted()}</Text>
              <Text style={styles.generic}>Current Streak: {this.getCurrentStreak()}</Text>
              <Text style={styles.generic}>Longest Streak: {this.getLongestStreak()}</Text>
              
          </View>
        )
    }
}

const styles = StyleSheet.create({
    generic : {
        fontSize: 18
    },
})

function mapStateToProps (state) {
  return {
    entries: state.entries,
  }
}
export default connect(mapStateToProps)(StatBox)