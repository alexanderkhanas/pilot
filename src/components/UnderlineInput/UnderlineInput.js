import React from 'react';
import { TextInput, Text, View, Platform } from 'react-native';
import s from './UnderlineInput.s';

export default ({
  // style: customStyle,
  color,
  label,
  value,
  borderColor,
  style,
  containerStyle,
  reference,
  labelColor,
  ...rest
}) => {
  // let viewWidth;
  // let otherStyle;
  // if (customStyle && customStyle.width) {
  //   const { width, ...style } = customStyle;
  //   viewWidth = width;
  //   otherStyle = { ...style };
  // }
  const isIos = Platform.OS === 'ios';
  const realColor = color || '#eee';
  return (
    <View style={{ ...containerStyle }}>
      {label && <Text style={{ ...s.label, color: labelColor || realColor }}>{label}</Text>}
      <TextInput
        style={{
          ...s.input,
          borderBottomColor: borderColor ? borderColor : realColor,
          color: realColor,
          paddingVertical: isIos ? 10 : 0,
          ...style,
        }}
        ref={reference}
        placeholderTextColor={realColor + '80'}
        value={value}
        {...rest}
      />
    </View>
  );
};
