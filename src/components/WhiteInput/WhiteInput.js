import React, { forwardRef } from 'react';
import s from './WhiteInput.s';
import { TextInput, Platform } from 'react-native';

export default forwardRef(
  ({ style, value, onChangeText, placeholder, keyboardType = 'default', ...rest }, ref) => {
    return (
      <TextInput
        style={{ ...s.input, ...style }}
        {...{ ref, placeholder, onChangeText, value, keyboardType }}
        {...rest}
      />
    );
  },
);
