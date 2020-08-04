import React, { useState } from 'react';
import s from './AutocompleteInput.s';
import { ScrollView, TouchableOpacity, TextInput, Text } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import WhiteInput from '../WhiteInput/WhiteInput';

export default ({
  defaultValue,
  onChangeText,
  data,
  onItemPress,
  containerStyle,
  listContainerStyle,
  type = 'street',
  theme,
  ...rest
}) => {
  const [hideResults, setHideResults] = useState(true);
  const onFocus = () => setHideResults(false);
  const onBlur = () => setHideResults(true);
  let counter = 0;
  return (
    <Autocomplete
      {...{ data }}
      listStyle={s.listStyle}
      inputContainerStyle={{
        borderColor: '#cccccc00',
      }}
      containerStyle={{ ...s.container, ...containerStyle }}
      listStyle={listContainerStyle}
      {...{ hideResults }}
      renderTextInput={() => (
        <WhiteInput
          {...{ onFocus }}
          {...{ onBlur }}
          onChangeText={(text) => onChangeText(text)}
          value={defaultValue}
          placeholderTextColor={theme.text + '80'}
          style={{ ...s.input, backgroundColor: theme.anotherMain, color: theme.text }}
          {...rest}
        />
      )}
      renderItem={({ item }) => {
        let i = data.indexOf(item);
        return type === 'house' ? (
          <HouseRenderItem {...{ item }} {...{ type }} {...{ i }} key={i} {...{ onItemPress }} />
        ) : (
          <StreetRenderItem {...{ item }} {...{ type }} {...{ i }} key={i} {...{ onItemPress }} />
        );
      }}
    />
  );
};

const HouseRenderItem = ({ item, i, onItemPress }) => {
  return (
    <TouchableOpacity style={s.autocompleteItem} onPress={() => onItemPress(item)}>
      <Text>{item.NAMEHS}</Text>
    </TouchableOpacity>
  );
};

const StreetRenderItem = ({ item, i, onItemPress }) => {
  if (!item.name) return;
  const splitStr = item.name.split(' ');
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  const name = splitStr.join(' ');
  return (
    <TouchableOpacity
      style={{
        ...s.autocompleteItem,
      }}
      onPress={() => onItemPress({ ...item, name })}
    >
      <Text>{name}</Text>
    </TouchableOpacity>
  );
};
