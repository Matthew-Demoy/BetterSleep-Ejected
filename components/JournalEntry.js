import React from 'react'
import {StyleSheet, TouchableOpacity,ScrollView, View, Button, Text, Switch, TextInput, Alert, KeyboardAvoidingView, AsyncStorage} from 'react-native'
import {AddEntry, EditEntry, DeleteEntry} from '../actions/JournalActions'
import {connect} from 'react-redux'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import DateTimePicker from 'react-native-modal-datetime-picker';
import CleanDate from './CleanDate'
import * as firebase from 'firebase';

import {guidGenerator} from './GenerateId'

// The JournalEntry screen is where users will create a new journal entry
// It takes in a number of inputs from the user then sends that information to the store
class JournalEntry extends React.Component{

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
  }


    // Each Journal Entry is composed of 4 Parts(text,grade,didNutrition,didExercise) 
    // So we must temporarily hold this information when making a new entry
    constructor (props) {
      super(props)
      
      date = new Date()

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

      itemId = this.props.navigation.getParam('id')
      journals = this.props.navigation.getParam('data')
      this.journals = journals
      
      var user = firebase.auth().currentUser
      
      if(itemId !== undefined)
      {
        data = journals.find(obj => { return obj.id === itemId });
        console.log("data " + Object.keys(data)[0]) 
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
            entries: null
          
        }
      }
      else
      {

        this.state = {
          text :  data.journal,
          height: 0,
          grade : data.grade,
          didNutrition : data.didNutrition,
          didExercise : data.didExercise,
          date : data.date,
          isDateTimePickerVisible: false,
          itemId : data.id,
          entries: null
        }
      }
      
    }
    /*
    adjustdate = () => {
      initDateRecent = false
      date = new Date()
      while(initDateRecent === false)
      {
        if(date - this.state.mostRecent <= 0)
        {
          console.log("adding a day")
          date = new Date(date.getTime() + 60 * 60 * 24 * 1000)
        }
        else
        {
          initDateRecent = true
        }
      }
      this.setState({date:this.dashedString(date)})
    }
    */
   
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
      console.log(selectedDate)
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
            id: child.key
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

    submit = (itemId) => {
      console.log("submit")
      console.log(itemId)

      this._storeMostRecent()

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
                {getGradeIcon(this.state.grade)}
                <Text style={styles.basicText}>How was your day?</Text>
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
                
                <View style={styles.row}>
                  <Text style={{fontSize:18, paddingLeft:10}}>Did you perform a daily exercise?</Text>
                  <Switch onValueChange={this.exerciseSwitch} value={this.state.didExercise}/>
                </View>
                
                <View style={styles.row}>
                  <Text style={{fontSize:18, paddingLeft:10}}>Did you follow your nutrition?</Text>
                  <Switch onValueChange={this.nutritionSwitch} value={this.state.didNutrition}/>
                </View>

                <Text style={{fontSize:18, paddingLeft:10}} style={styles.basicText}>What about your day went well?</Text>
                <TextInput multiline={true} numberOfLines = {4} placeholder="You may journal here" style={{height: 40,borderColor:'gray', fontSize:20, borderWidth: 1, height: Math.max(35, this.state.height)}}
                  onChangeText={(text) => this.setState({text})} value={this.state.text}
                  onContentSizeChange={(event) => {
                    this.setState({ height: event.nativeEvent.contentSize.height })
                  }}>
                  
                </TextInput>
                <Button
                  title="Submit"
                  color="#27A8E6"
                  accessibilityLabel="Learn more about this purple button"
                  onPress={this.submit.bind(itemId,this.state.itemId)}
                />

            </ScrollView>
            </KeyboardAvoidingView>
            
        )
    }
}

function mapStateToProps (state) {
  console.log(state.dailyExercise)
  return {
    entries: state.entries,
    dailyExercise : state.dailyExercise,
    dailyNutrition : state.dailyNutrition
  }
}

function getGradeIcon(grade){
    switch(grade){
      case 0: 
          return(
            <View style={[styles.gradeContainer]}>
              <MaterialCommunityIcons
                name='emoticon-sad-outline'
                color='#4f83cc'
                size={45}
              />
            </View>
          )
  
      case 1:
          return(
                <View style={[styles.gradeContainer]}>
                  <MaterialCommunityIcons
                    name='emoticon-neutral-outline'
                    color='#4f83cc'
                    size={45}
                  />
                </View>
              )
      case 2:
          return(
            <View style={[styles.gradeContainer]}>
              <MaterialCommunityIcons
                name='emoticon-happy-outline'
                color='#4f83cc' 
                size={45}
              />
            </View>
          )
    }
  }

  
export default connect(mapStateToProps)(JournalEntry);

const styles = StyleSheet.create({
    gradeButton: {
        backgroundColor: '#fff',
        marginTop: 12,
        height: 50,
    },
    iconContainer: {
        flexDirection: 'row',
        marginLeft: 'auto',
        alignItems: 'flex-end',
      },
      row: {
        justifyContent: 'space-evenly',
        flexDirection: 'row',
      },
      gradeContainer: {
        alignSelf : 'center'
      },
      basicText : {
        fontSize:18
      }
})
