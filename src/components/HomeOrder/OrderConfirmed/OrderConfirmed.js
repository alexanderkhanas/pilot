import React from 'react';
import s from './OrderConfirmed.s';
import { View, Text } from 'react-native';

export default (props) => {
  return (
    <View style={s.container}>
      <Text style={s.text}>Замовлення підтверджено</Text>
      <Text style={s.text}>Приємної поїздки!</Text>
    </View>
  );
};
