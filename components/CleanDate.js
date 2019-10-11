import React from 'react'
import {Text, StyleSheet} from 'react-native'

class CleanDate extends React.PureComponent {

    constructor(props){
        super(props)
        this.state = {
            year: null,
            month: null,
            day: null
        }
    }
    
    componentDidUpdate(props) {

        if( props.date != null)
        {
            this.setState = ({
                year: props.date.substring(0,4),
                month: props.date.substring(6,7),
                day: props.date.substring(8,10)
            })
        }
      }

    monthToString = (month) =>
    {
        var monthString = new Array();
        monthString[0] = "January";
        monthString[1] = "February";
        monthString[2] = "March";
        monthString[3] = "April";
        monthString[4] = "May";
        monthString[5] = "June";
        monthString[6] = "July";
        monthString[7] = "August";
        monthString[8] = "September";
        monthString[9] = "October";
        monthString[10] = "November";
        monthString[11] = "December";


        return monthString[month - 1]
    }
    
    render(){
        year = this.props.date.substring(0,4),
        month = this.props.date.substring(6,7),
        day = this.props.date.substring(8,10)

        return(
            <Text style={styles.date}>{this.monthToString(month)} {day} {year}</Text>
        )
    }
}

const styles = StyleSheet.create({
    date: {
        marginTop:0,
        fontSize: 24,
        color: "#AEAEAE"
    }
})

export default CleanDate