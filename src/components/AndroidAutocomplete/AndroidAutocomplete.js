import React from 'react';
import s from './AndroidAutocomplete.s';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

export default ({ data, elementKey, onPress, top }) => {
  return (
    <ScrollView style={{ ...s.andrAutocomplete, top }} keyboardShouldPersistTaps="always">
      {data.map((el, i) => {
        // if (typeof el.IDNP) return;
        let name = el[elementKey];
        if (elementKey == 'NAMEST') {
          const splitStr = el.NAMEST.toLowerCase().split(' ');
          for (let i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
          }
          name = splitStr.join(' ');
        }
        return (
          <TouchableOpacity
            style={{ ...s.autocompleteItem, zIndex: 100000 }}
            key={i}
            onPress={() => onPress(el, name)}
          >
            <Text style={s.text}>{name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
