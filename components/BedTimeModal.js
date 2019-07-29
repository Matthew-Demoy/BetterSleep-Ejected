
import React from 'react'
import Modal from 'react-native-modalbox';
import DatePicker from 'react-native-datepicker'
import {Text, View, AsyncStorage, StyleSheet} from 'react-native'
import {EnterBedTime} from '../actions/JournalActions'
import {connect} from 'react-redux'
class BedTimeModal extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
          isOpen: this.props.open,
          isDisabled: false,
          swipeToClose: true,
          sliderValue: 0.3,
          bedTime: "22:00"
        };
      }

    onClose() {
        console.log('Modal just closed');
    }
      onOpen() {
        console.log('Modal just opened');
      }

      componentDidMount(){
        if(this.state.isOpen == true)
        {
          //this.open();
        }
      }
    
      onClosingState(state) {
        console.log('the open/close of the swipeToClose just changed');
        //this.storeBedTime();
        this.props.hideModal();
      }

    async storeBedTime() {
        console.log("storing bed time")
            try {
                await AsyncStorage.setItem('BEDTIME', this.state.bedTime);
                console.log("async bedtime is " + time);
              } catch (error) {
                // Error saving data
                console.log("bedTime store error " + error)
              }
    }

    changeBedTime = (time) => {
        console.log(time)
        if(time !== this.state.bedTime)
        {
            this.setState({bedTime: time});
            this.props.dispatch(EnterBedTime(
                this.state.bedTime
              ))
        }
        console.log("bedtime is " + time);
    }

    render() {
        return(
            <Modal
                style={[styles.modal, styles.modal1]}
                ref={"modal1"}
                swipeToClose={this.state.swipeToClose}
                isOpen={this.props.open}
                onClosed={this.onClose}
                onOpened={this.onOpen}
                onClosingState={this.onClosingState}>
                <View style={styles.container}>
                  <Text style={styles.title}>What time will you go to sleep?</Text>
                  <DatePicker
                      style={styles.timePicker}
                      date={this.state.bedTime}
                      mode="time"
                      format="HH:mm"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      minuteInterval={1}
                      onDateChange={this.changeBedTime}
                  />
                  <Text> Swipe down when finished </Text>
                </View>

            
            </Modal>
        )
    }
}

function mapStateToProps (state) {
    console.log(state.dailyExercise)
    return {
      dailyExercise : state.dailyExercise,
      dailyNutrition : state.dailyNutrition
    }
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center'

    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
    },
    timePicker: {
      paddingTop:10,
      width:300
    },
    subText: {
      fontSize:11
    }
  });



export default connect(mapStateToProps)(BedTimeModal);