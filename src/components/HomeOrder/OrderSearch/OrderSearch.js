import React from 'react';
import s from './OrderSearch.s';
import { Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useStore } from '../../../stores/createStore';
import { observer } from 'mobx-react';

const OrderSearch = ({ cancelTripHandler }) => {
  const { theme } = useStore((store) => store.viewer);
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={s.cancelButton} onPress={cancelTripHandler}>
        <Text style={s.cancelText}>Відмінити</Text>
      </TouchableOpacity>

      <View style={s.container}>
        <Text style={{ ...s.text, color: theme.text }}>Шукаємо для Вас автомобіль</Text>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    </View>
  );
};

export default observer(OrderSearch);
