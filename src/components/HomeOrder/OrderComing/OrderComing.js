import React from 'react';
import s from './OrderComing.s';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { useStore } from '../../../stores/createStore';
import { observer } from 'mobx-react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const OrderComing = ({ navigation, cancelTripHandler, centerCar, isCarCoords }) => {
  const { theme, order, driver } = useStore((store) => store.viewer);
  console.log(driver);

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={s.cancelButton} onPress={cancelTripHandler}>
        <Text style={s.cancelText}>Відмінити</Text>
      </TouchableOpacity>
      {isCarCoords && (
        <View style={{ ...s.centerCarIconContainer, borderColor: theme.text + '99', flex: 1 }}>
          <FontAwesome5Icon
            onPress={centerCar}
            style={s.centerCarIcon}
            name="car"
            size={25}
            color={theme.text}
          />
        </View>
      )}

      {/* {!order.distance ? ( */}
      {/* <View style={s.container}>
        <View style={s.row}>
          <FontAwesome5Icon name="car" size={28} color={theme.text} />
          <Text style={{ ...s.text, color: theme.text }}>
            {order.car}, № {order.number}, {order.color}
          </Text>
        </View>
        <View style={s.footer}>
          <Text style={{ ...s.footerText, color: theme.text }}>{order.time}</Text>
          <Text style={{ ...s.footerText, color: theme.text }}>{order.distance}</Text>
        </View>
      </View>
      ) : ( */}
      <View style={{ ...s.container }}>
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
      </View>
      {/* )} */}
    </View>
  );
};

export default observer(OrderComing);
