import React from 'react';
import s from './DriverInfo.s';
import { View, Text, Image } from 'react-native';
import userIcon from '../../../assets/userIcon.png';
import { useStore } from '../../stores/createStore';
export default ({ driver, style }) => {
  const { theme } = useStore((store) => store.viewer);
  return (
    <View style={{ ...s.driverInfoContainer, ...style, backgroundColor: theme.anotherMain }}>
      <Image style={s.driverIcon} source={userIcon} />
      <Text style={{ ...s.driverName, color: theme.text }}>{driver.name}</Text>
      <Text style={{ ...s.driverNumber, color: theme.text }}>№ {driver.carNumber}</Text>
    </View>
  );
};
