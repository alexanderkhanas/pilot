import React from 'react';
import s from './OrderWaiting.s';
import { View, Text, ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react';
import { useStore } from '../../../stores/createStore';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const OrderWaiting = (props) => {
  const { theme, driver } = useStore((store) => store.viewer);
  return (
    <View style={s.container}>
      <Text style={{ ...s.title, color: theme.text }}>Водій вже чекає на Вас</Text>
      <View style={s.row}>
        <FontAwesome5Icon style={s.icon} name="car" size={28} color={theme.text} />
        <Text style={{ ...s.text, color: theme.text }}>{driver.car}</Text>
      </View>
      <View style={s.row}>
        <FontAwesome5Icon style={s.icon} name="taxi" size={28} color={theme.text} />
        <Text style={{ ...s.text, color: theme.text }}>{driver.number}</Text>
      </View>
      <View style={s.row}>
        <FontAwesome5Icon style={s.icon} name="brush" size={28} color={theme.text} />
        <Text style={{ ...s.text, color: theme.text }}>{driver.color}</Text>
      </View>
      {/* //<ActivityIndicator size="large" color={theme.text} /> */}
    </View>
  );
};

export default observer(OrderWaiting);
