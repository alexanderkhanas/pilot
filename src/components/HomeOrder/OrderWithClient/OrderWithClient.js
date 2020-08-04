import React from 'react';
import s from './OrderWithClient.s';
import { observer } from 'mobx-react';
import { View, Text } from 'react-native';
import { useStore } from '../../../stores/createStore';

const OrderWithClient = (props) => {
  const { theme } = useStore((store) => store.viewer);
  return (
    <View style={{ flex: 1 }}>
      <View style={s.container}>
        <Text style={{ ...s.text, color: theme.text }}>Вітаємо в авто {'\n'}"Таксі Пілот"</Text>
      </View>
    </View>
  );
};

export default observer(OrderWithClient);
