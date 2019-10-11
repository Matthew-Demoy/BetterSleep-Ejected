import React from 'react'
import {StyleSheet, TouchableOpacity,ScrollView, View, Button, Text, Switch, TextInput, Alert, KeyboardAvoidingView} from 'react-native'
import {DeleteEntry} from '../actions/JournalActions'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import DateTimePicker from 'react-native-modal-datetime-picker';
import DatePicker from 'react-native-datepicker'
import CleanDate from './CleanDate'
import * as firebase from 'firebase';
import {connect} from 'react-redux'

import {guidGenerator, getGradeIcon} from './util'

// The JournalEntry screen is where users will create a new journal entry
// It takes in a number of inputs from the user then sends that information to the store
// Sorry about the spaghetti code essentialy this component has to deal with both creating a new entry and editing old ones
// So essentially there is a branch in just about every functioning depending on if it is the former or latter

class JournalEntry extends React.Component{

  // Adds options button and exit in the header of the app
  static navigationOptions = ({ navigation }) => {
    // headerTitle instead of title
    return {
      headerStyle:  {
        backgroundColor: '#27A8E6'
   },
   headerTintColor: '#fff',
   headerRight: (
     <TouchableOpacity style={{marginLeft:'auto', marginRight:10}} onPress={navigation.getParam('options')}>
                 <SimpleLineIcons
                   name='options'
                   color='white'
                   size={30}
                 />
     </TouchableOpacity>
     )
    }
  };

  componentDidMount() {
    this.props.navigation.setParams({ options: this.options.bind(this.state.itemId) });
    this.listenForItems(this.getItemsRef)
    this.getBedTime;
  }

  getBedTime = async () => {
    try {
      const value = await AsyncStorage.getItem('BEDTIME');
      if (value !== null) {
        this.setState({bedTime : value})
        console.log("async getBedTime " + value);
      }
    } catch (error) {
      console.log("async " + error)
      // Error retrieving data
    }
  };


    // Each Journal Entry is composed of 4 Parts(text,grade,didNutrition,didExercise) 
    // So we must temporarily hold this information when making a new entry or editing one
    // The constructor figures out if it is making a new or editing an entry and then setting the state accordingly
    constructor (props) {
      super(props)
      
      date = new Date()
      selectedDate = this.dashedString(date)

      itemId = this.props.navigation.getParam('id')
      journals = this.props.navigation.getParam('data')
      this.journals = journals
      
      var user = firebase.auth().currentUser
      
      if(itemId !== undefined)
      {
        data = journals.find(obj => { return obj.id === itemId });
        console.log("data " + Object.keys(data)) 
        userLocation = "users/" + user.uid + "/journals/" + data.id
        this.sendItemsRef = firebase.database().ref(userLocation);
      }
      else{ 
        newId = guidGenerator()
        userLocation = "users/" + user.uid + "/journals/" + newId
        this.sendItemsRef = firebase.database().ref(userLocation);
      }
      
      this.getItemsRef = firebase.database().ref("users/" + user.uid + "/journals");
      if(itemId === undefined)
      {
        itemId = -1
        const defaultExercise = this.props.dailyExercise
        const defaultNutrition = this.props.dailyNutrition

          this.state = {
            text: "",
            height: 0,
            grade: 1,
            didNutrition: defaultNutrition,
            didExercise: defaultExercise,
            date: selectedDate,
            isDateTimePickerVisible: false,
            itemId : newId,
            entries: null,
            bedTime: this.props.bedTime,
            wakeTime: "9:00"
          
        }
      }
      else
      { 
        console.log("bedTime in state " + data.bedTime)
        console.log("wakeTime in state " + data.wakeTime)
        this.state = {
          text :  data.journal,
          height: 0,
          grade : data.grade,
          didNutrition : data.didNutrition,
          didExercise : data.didExercise,
          date : data.date,
          isDateTimePickerVisible: false,
          itemId : data.id,
          entries: null,
          bedTime: data.bedTime,
          wakeTime: data.wakeTime
        }
      }
    }

    dashedString = (date) => {
      if(date.getMonth() + 1 < 10)
      {
        if(date.getDate() < 10)
        {
          selectedDate = date.getFullYear() + "-0"+ parseInt(date.getMonth() + 1) +"-0"+ date.getDate()
        }
        else
        {
          selectedDate = date.getFullYear() + "-0"+ parseInt(date.getMonth() + 1) +"-"+ date.getDate()
        }
      }
      else{
        if(date.getDate() < 10)
        {
          selectedDate = date.getFullYear() + "-"+ parseInt(date.getMonth() + 1) +"-0"+ date.getDate()
        }
        else
        {
          selectedDate = date.getFullYear() + "-"+ parseInt(date.getMonth() + 1) +"-"+ date.getDate()
        }
      }
      return selectedDate
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
            wakeTime : child.val().wakeTime,
            bedTime : child.val().bedTime,
            id: child.key,
          });
        });
      
        entries.sort(function(a,b){
          return new Date(b.date) - new Date(a.date) })
  
        this.setState({
          entries: entries
        });
  
      });
    }

    onLousyButtonPrs = () => {
      this.setState({
        grade: 0
      });
    }

    onDecentButtonPrs = () => {
      this.setState({
        grade: 1
      });
    }

    onGreatButtonPrs = () => {
      this.setState({
        grade: 2
      },() => 
      console.log(this.state.grade));
      
    }

    exerciseSwitch = () => {
      this.state.didExercise === true 
      ? this.setState({
        didExercise: false
      })
      :
      this.setState({
        didExercise: true
      })
    }

    nutritionSwitch = () => {
      this.state.didNutrition === true 
      ? this.setState({
        didNutrition: false
      })
      :
      this.setState({
        didNutrition: true
      })
    }

    //When the user is ready to commit a change to their journal
    // they either PUSH new entry or UPDATE an old one
    // Then the app navigates back to the previous screen
    submit = (itemId) => {
      console.log("submit")
      console.log(itemId)

      //this._storeMostRecent()

      if (itemId === -1)
      {
        key = 0
        for (i = 0; i < this.props.entries.length - 1; i++)
        {
          if(key === this.props.entries[i])
          {
            key = key + 1
          }
        }

        this.sendItemsRef.push({ 
          text: this.state.text,
          didExercise: this.state.didExercise,
          didNutrition: this.state.didNutrition,
          emotion: this.state.grade,
          date: this.state.date,
          id : this.state.itemId,
          bedTime: this.state.bedTime,
          wakeTime: this.state.wakeTime
        })
      }
      else
      {

        console.log("updating ref")
        this.sendItemsRef.update({
          text: this.state.text,
          didExercise: this.state.didExercise,
          didNutrition: this.state.didNutrition,
          emotion: this.state.grade,
          date: this.state.date,
          id : itemId,
          bedTime: this.state.bedTime,
          wakeTime: this.state.wakeTime
        })
      }
      this.props.navigation.pop()
      this.props.navigation.navigate('Journal')
    }

    options = (itemId) => {
      Alert.alert(
        'Additional Options',
        'Reset or Delete the entry',
        [
          {text: 'Delete', onPress: this.deleteWarning.bind(itemId, itemId)},
          {text: 'Reset', onPress: this.reset.bind()},
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }

    deleteWarning = (itemId) => {
      Alert.alert(
        'Deleting Journal Entry',
        'Are you sure you want to permanently delete this entry?',
        [
          {text: 'Delete', onPress: this.delete.bind(itemId, itemId)},
          {
            text: 'Cancel',
            onPress: this.options.bind(itemId,itemId),
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }

    reset = () =>{
      console.log("reset")
      this.setState({
        text: "",
        grade: 1,
        didNutrition: false,
        didExercise: false,
      })
      console.log(this.state.didNutrition)
    }

    delete = (itemId) => {
      console.log(this.state.itemId)
      if (itemId != -1)
      {
        this.sendItemsRef.remove();
        this.props.dispatch(DeleteEntry(
          this.state.itemId
        ))
      }
      this.props.navigation.navigate('Journal')
    }

    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });
 
    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });
  
    _handleDatePicked = (date) => {
      selectedDate = this.dashedString(date)

      console.log("checking journals1")
      if(this.state.entries !== undefined)
      {
        console.log("checking journals")
        data = this.state.entries.find(obj => { 
          console.log(obj.date)
          console.log(selectedDate)
          return obj.date === selectedDate});
      }
      
      console.log("selected date for new entry" + selectedDate)
      if( data !== undefined )
      {
        setTimeout(() => {
          Alert.alert("Entry for Date already exists", "If youd like edit a specific entry, select it from the journal screen");
        }, 500);
        
      }
      else
      {
        this.setDate(selectedDate)
      }
      
      this._hideDateTimePicker();
    };

    setDate= (date) =>{
      this.setState({date:date})
    }


    render(){
        return(
            <KeyboardAvoidingView behavior='padding'>
              <ScrollView>
                <TouchableOpacity style={{alignSelf:'center'}} onPress={this._showDateTimePicker}>
                  <CleanDate date={this.state.date} />
                </TouchableOpacity>
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this._handleDatePicked}
                  onCancel={this._hideDateTimePicker}
                />

                <View style={{alignSelf:'center'}}>
                <View style={{alignSelf:'center', paddingBottom: 0}}>
                  {getGradeIcon(this.state.grade, 90)}
                </View>
          
                <Text style={{fontSize:40}}>How was your day?</Text>
                </View>
                <View style={styles.row}>
                  <TouchableOpacity style={styles.gradeButton} onPress={this.onLousyButtonPrs}>
                      <Text style={styles.basicText} >Lousy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.gradeButton} onPress={this.onDecentButtonPrs}>
                      <Text style={styles.basicText}>Decent</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.gradeButton} onPress={this.onGreatButtonPrs}>
                      <Text style={styles.basicText}>Great</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={{marginVertical:20}}>
                  <View style={styles.dailyQuestions}>
                    <Text style={{fontSize:18, paddingLeft:10}}>Did you perform a daily exercise?</Text>
                    <Switch onValueChange={this.exerciseSwitch} value={this.state.didExercise}/>
                  </View>
                  
                  <View style={styles.dailyQuestions}>
                    <Text style={{fontSize:18, paddingLeft:10}}>Did you follow your nutrition?</Text>
                    <Switch onValueChange={this.nutritionSwitch} value={this.state.didNutrition}/>
                  </View>
                </View>


                <Text style={{fontSize:20, paddingLeft:10, alignSelf: "center"}} >What about your day went well?</Text>
                
                  <View style={{height:10}} />
                  <TextInput multiline={true} numberOfLines = {4} placeholder=" You may journal here" style={{marginHorizontal: 10, paddingHorizontal: 10, borderColor:'gray', fontSize:20,borderRadius: 5, backgroundColor: 'lightgray', height: Math.max(100, this.state.height)}}
                    onChangeText={(text) => this.setState({text})} value={this.state.text}
                    onContentSizeChange={(event) => {
                      this.setState({ height: event.nativeEvent.contentSize.height })
                    }}>
                  </TextInput>

                <Text style={{fontSize:20, alignSelf:"center", marginVertical: 10}}>When did you Wake up and Sleep?</Text>
                <View style={styles.row}>
                    <View style={{alignItems:"center"}}>
                      <Text >Wake up</Text>
                      <DatePicker
                          style={{width: 100}}
                          date={this.state.wakeTime}
                          mode="time"
                          format="h:mm A"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          minuteInterval={10}
                          onDateChange={(time) => {this.setState({wakeTime:time})}}
                      />
                    </View>
                    
                    <View style={{alignItems:"center"}}>
                      <Text>Sleep</Text>  
                      <DatePicker
                          style={{width: 100}}
                          date={this.state.bedTime}
                          mode="time"
                          format="h:mm A"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          minuteInterval={10}
                          onDateChange={(time) => {this.setState({bedTime:time})}}
                      />
                    </View>
                </View>

                <View>
                
                <View style={{alignItems:"center"}}>
                  <TouchableOpacity style={styles.gradeButton} accessibilityLabel="Learn more about this purple button"onPress={this.submit.bind(itemId,this.state.itemId)}>
                        <Text style={styles.basicText} >Submit</Text>
                    </TouchableOpacity>
                </View>

                </View>


            </ScrollView>
            </KeyboardAvoidingView>
            
        )
    }
}

function mapStateToProps (state) {
  console.log(state.dailyExercise)
  return {
    dailyExercise : state.dailyExercise,
    dailyNutrition : state.dailyNutrition,
    bedTime: state.bedTime
  }
}

  
export default connect(mapStateToProps)(JournalEntry);

const styles = StyleSheet.create({
    gradeButton: {
        backgroundColor: '#27A8E6',
        marginTop: 12,
        height: 50,
        width:'30%',
      justifyContent: 'center',
      alignItems:'center',
      borderRadius: 10
    },
    iconContainer: {
        flexDirection: 'row',
        marginLeft: 'auto',
        alignItems: 'flex-end',
      },
      row: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        flex: 1,
      },
      basicText : {
        fontSize:20,
        color: 'white',
        fontWeight: "bold",
      },
      dailyQuestions: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal: 5,
        marginTop: 5
      }
})
