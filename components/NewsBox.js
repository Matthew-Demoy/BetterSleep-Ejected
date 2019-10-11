import React from 'react'
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Platform } from 'react-native'
import { FontAwesome, 
  MaterialIcons,
  MaterialCommunityIcons 
  } from 'react-native-vector-icons'
  import PropTypes from 'prop-types';


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
        <TouchableOpacity onPress={this._onPress}>
          <View style={{ borderColor: 'white', marginBottom: 10}}>
            <View style={[styles.row, {marginVertical:12}]}>
                <Text style={{fontSize:30, width: "100%", fontWeight: '600'}}>{title}</Text>
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
  outerBox:{
    width: "97%",
    alignSelf: 'center',
    borderColor: "lightgray",
    borderBottomWidth: 1,
    paddingBottom: 5
  },
  row: {
    alignItems: 'center',
    justifyContent: 'center', 
    marginBottom: 10
  },
  journalText : {
    fontSize: 18,
  }
})

