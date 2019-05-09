import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Platform } from 'react-native'
import { FontAwesome, 
  MaterialIcons,
  MaterialCommunityIcons 
  } from 'react-native-vector-icons'
  import PropTypes from 'prop-types';
  import {getGradeIcon} from './util'

class NewsBox extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.id);
  };
  

  render() {
    if(Platform.OS == 'android')
    {
      title = this.props.FigurativeTitle
    }
    else
    {
      title = this.props.LiteralTitle
    }
    return (
      <View style={styles.outerBox}>
        <TouchableOpacity style={styles.roundBox} onPress={this._onPress}>
          <View style={{ borderColor: 'white'}}>
            <View style={[styles.row, {marginTop:12}]}>
                <Text style={{fontSize:30}}>{title}</Text>
              </View>
              <Text style={styles.journalText}>{this.props.Description}</Text>
            </View>
        </TouchableOpacity>
      </View>
    );
  }
}

NewsBox.propTypes = {
  Title: PropTypes.string.isRequired,
  Description: PropTypes.string.isRequired,
}

export class NewsBoxList extends React.PureComponent {
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

    <NewsBox
      FigurativeTitle={item.FigurativeTitle}
      LiteralTitle={item.LiteralTitle}
      Description={item.Content}
      onPressItem={this._onPressItem}
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

NewsBoxList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
      journal: PropTypes.string.isRequired,
      didExercise: PropTypes.bool.isRequired,
      didNutrition: PropTypes.bool.isRequired,
      grade: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired
    })).isRequired
}




const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginLeft:12,
    marginRight:12,
    
  },
      gradeContainer: {
        alignSelf : 'center'
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
  journalText : {
    fontSize: 18,
    marginLeft:5, 
    marginRight:5
  }
})

