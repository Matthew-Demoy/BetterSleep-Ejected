/**
 * Fancy ID generator that creates 20-character string identifiers with the following properties:
 *
 * 1. They're based on timestamp so that they sort *after* any existing ids.
 * 2. They contain 72-bits of random data after the timestamp so that IDs won't collide with other clients' IDs.
 * 3. They sort *lexicographically* (so the timestamp is converted to characters that will sort properly).
 * 4. They're monotonically increasing.  Even if you generate more than one in the same timestamp, the
 *    latter ones will sort after the former ones.  We do this by using the previous random bits
 *    but "incrementing" them by 1 (only in the case of a timestamp collision).
 */

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react'
import {View, StyleSheet} from 'react-native'


export function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4());
}

export function getGradeIcon(grade, size){
    switch(grade){
      case 0: 
          return(
            <View style={[styles.gradeContainer]}>
              <MaterialCommunityIcons
                name='emoticon-sad-outline'
                color='#4f83cc'
                size={size}
              />
            </View>
          )
  
      case 1:
          return(
                <View style={[styles.gradeContainer]}>
                  <MaterialCommunityIcons
                    name='emoticon-neutral-outline'
                    color='#4f83cc'
                    size={size}
                  />
                </View>
              )
      case 2:
          return(
            <View style={[styles.gradeContainer]}>
              <MaterialCommunityIcons
                name='emoticon-happy-outline'
                color='#4f83cc' 
                size={size}
              />
            </View>
          )
    }
  }

styles = StyleSheet.create({
    gradeContainer: {
        alignSelf : 'center'
      },
})