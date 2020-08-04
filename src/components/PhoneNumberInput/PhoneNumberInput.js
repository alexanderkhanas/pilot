import React, { forwardRef, useRef } from 'react';
import s from './PhoneNumberInput.s';
import { TextInput, View, Text } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { useStore } from '../../stores/createStore';
import { observer } from 'mobx-react';
import { TextInputMask } from 'react-native-masked-text';

const PhoneInput = forwardRef(({ style, inputStyle, ...rest }, ref) => {
  const inputRef = useRef();
  const attachRef = (target) => {
    if (ref) ref.current = target;
    inputRef.current = target;
  };

  const { theme } = useStore((s) => s.viewer);
  return (
    <View onTouchStart={() => inputRef.current.focus()} style={{ ...s.container, ...style }}>
      <FontAwesome5Icon solid color={theme.text} name="user" size={30} />
      <View style={s.inputContainer}>
        <Text style={{ ...s.prefix, color: theme.text, borderColor: theme.text }}>+380</Text>
        <TextInputMask
          type="custom"
          options={{ mask: '999999999' }}
          refInput={attachRef}
          style={{ ...s.input, ...inputStyle, color: theme.text }}
          placeholder="501234567"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          // maxLength={9}
          {...rest}
        />
        {/* <TextInput /> */}
      </View>
    </View>
  );
});

export default observer(PhoneInput);
