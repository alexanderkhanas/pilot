import React from 'react';
import { Image } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default ({ size = 1, style }) => {
  const styles = {
    width: wp(45) * size,
    height: wp(40) * size,
  };
  return <Image source={require('../../assets/logo.png')} style={{ ...styles, ...style }} />;
};
