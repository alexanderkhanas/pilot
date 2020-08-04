import React, { useState, useEffect } from 'react';
import s from './Header.s';
import { View, Text, Image, Platform, AsyncStorage } from 'react-native';
import backIcon from '../../../assets/backIcon.png';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { colorThemes } from '../../styles/global';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { useStore } from '../../stores/createStore';
import { observer } from 'mobx-react';

const Header = ({ title, iconSource, iconRight, back, style: customStyle }) => {
  const { theme } = useStore((store) => store.viewer);
  const style =
    Platform.OS === 'android'
      ? {
          ...s.headerContainer,
          paddingVertical: hp(3),
          ...customStyle,
          backgroundColor: theme.anotherMain,
        }
      : {
          ...s.headerContainer,
          paddingVertical: hp(4),
          ...customStyle,
          backgroundColor: theme.anotherMain,
        };
  return (
    <View {...{ style }}>
      <FontAwesome5Icon
        color={theme.text}
        style={s.icon}
        onPress={() => back()}
        name="angle-left"
        size={30}
      />
      {/* <TouchableOpacity onPress={() => back()}>
          <Image source={backIcon} style={s.headerBackIcon} />
        </TouchableOpacity> */}
      <Text style={{ ...s.headerTitle, color: theme.text }}>{title}</Text>
      {/* <FontAwesome5Icon name="star" style={s.icon} solid color={theme.text} size={25} /> */}
      {iconRight ? iconRight : <Image source={iconSource} style={s.headerIcon} />}
    </View>
  );
};

export default observer(Header);
