import React from 'react';
import { Platform, TouchableOpacity, TouchableNativeFeedback } from 'react-native';

export default ({ children, ...rest }) => {
  return Platform.OS == 'ios' ? (
    <TouchableOpacity {...rest}>{children}</TouchableOpacity>
  ) : (
    <TouchableNativeFeedback {...rest}>{children}</TouchableNativeFeedback>
  );
};
