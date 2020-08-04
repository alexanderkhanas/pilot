import React from 'react';
import s from './RoundButton.s';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useStore } from '../../stores/createStore';
import { observer } from 'mobx-react';

const RoundButton = ({ onPress, text, style, textStyle, isLoading, disabled = false }) => {
  const { theme } = useStore((store) => store.viewer);
  return (
    <TouchableOpacity
      style={{ ...s.button, backgroundColor: theme.secondary, ...style }}
      {...{ onPress }}
      disabled={disabled}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.text} />
      ) : (
        <Text style={{ ...s.buttonText, ...textStyle, color: theme.text }}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

export default observer(RoundButton);
