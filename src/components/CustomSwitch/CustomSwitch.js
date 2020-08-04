import React from 'react';
import s from './CustomSwitch.s';
import { observer } from 'mobx-react';
import { View, TouchableHighlight, Text, TouchableWithoutFeedback } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const CustomSwitch = ({ buttons }) => {
  const iconSize = hp(5) > 40 ? 40 : hp(5);
  return (
    <View style={s.container}>
      {buttons.map((button, i) => {
        const {
          icon,
          isActive: isButtonActive,
          onPress,
          baseColor,
          activeColor,
          text = '',
        } = button;
        return (
          <TouchableWithoutFeedback key={i} onPress={onPress}>
            <View style={s[button.type + 'Button']}>
              {button.type === 'icon' ? (
                <View
                  style={{
                    ...s.iconContainer,
                    borderBottomColor: isButtonActive ? activeColor + '99' : '#00000000',
                  }}
                  w
                >
                  <FontAwesome5Icon
                    name={icon}
                    color={isButtonActive ? activeColor : baseColor}
                    style={s.icon}
                    solid={isButtonActive}
                    size={iconSize}
                  />
                </View>
              ) : (
                <Text style={s.text}>{text}</Text>
              )}
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
};

export default observer(CustomSwitch);
