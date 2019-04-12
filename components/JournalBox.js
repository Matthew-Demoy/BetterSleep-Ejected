import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

  import PropTypes from 'prop-types';
import CleanDate from './CleanDate'

class JournalBox extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };
  render() {
    return (
      <View style={styles.outerBox}>
        <TouchableOpacity style={styles.roundBox} onPress={this._onPress}>
          <View style={{ borderColor: 'white'}}>
            <View style={[styles.row, {marginTop:12}]}>
                {getGradeIcon(this.props.grade)}
                <CleanDate date={this.props.date}/>
                <View style={styles.iconContainer}>
                  {getExerciseIcon(this.props.didExercise)}
                  {getNutritionIcon(this.props.didNutrition)}
                </View>
              </View>
              <Text style={styles.journalText}>{this.props.journal}</Text>
            </View>
        </TouchableOpacity>
      </View>
    );
  }
}

JournalBox.propTypes = {
  journal: PropTypes.string.isRequired,
  didExercise: PropTypes.bool.isRequired,
  didNutrition: PropTypes.bool.isRequired,
  grade: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired
}

export class JournalBoxList extends React.PureComponent {
  state = {
    selected: (new Map(): Map<number, boolean>),
    journal: this.props.data
  };


  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
    console.log("data to entry " + this.props.data)
    this.props.navigation.navigate('Entry', { id : id, data : this.props.data})
  };

  _renderItem = ({item}) => (

    <JournalBox
      id={item.id}
      grade={item.grade}
      didExercise={item.didExercise}
      didNutrition={item.didNutrition}
      date={item.date}
      journal={item.journal}
      onPressItem={this._onPressItem}
      data={this.props.bonus}
      selected={!!this.state.selected.get(item.id)}
    />
  );


  render() {

    return (
      <FlatList
        data={this.props.data}
        extraData={this.state.selected}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    );
  }
}

JournalBoxList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
      journal: PropTypes.string.isRequired,
      didExercise: PropTypes.bool.isRequired,
      didNutrition: PropTypes.bool.isRequired,
      grade: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired
    })).isRequired
}

function getExerciseIcon(didExercise){
  if(didExercise){
    return(
        <View style={[styles.iconContainer]}>
          <FontAwesome
            name='heartbeat'
            color='#4f83cc'
            size={45}
          />
        </View>
    )
  }
  return(
      <View style={[styles.iconContainer]}>
      <MaterialIcons
        name='not-interested'
        color='#4f83cc'
        size={45}
      />
    </View>
  )
}

function getNutritionIcon(didNutrition){
  if(didNutrition){
    return(
        <View style={[styles.iconContainer]}>
          <MaterialCommunityIcons
            name='food-apple'
            color='#4f83cc'
            size={45}
          />
        </View>
    )
  }
  return(
      <View style={[styles.iconContainer]}>
      <MaterialIcons
        name='not-interested'
        color='#4f83cc'
        size={45}
      />
    </View>
  )
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

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginLeft:12,
    marginRight:12,
    
  },
  roundBox: {
    paddingBottom: 10,
    borderBottomWidth: 5,
    borderColor: 'grey'
  },
  outerBox:{
    
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  iconContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'flex-end'
  },
  gradeContainer: {
    alignItems: 'flex-start'
  },
  journalText : {
    fontSize: 18,
    marginLeft:5, 
    marginRight:5
  }
})

