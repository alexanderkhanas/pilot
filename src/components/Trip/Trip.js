import React, { useState, useEffect } from 'react';
import s from './Trip.s';
import { View, Image, Text, Animated } from 'react-native';
import scheduleIcon from '../../../assets/scheduleIcon.png';
import moneyIcon from '../../../assets/uah.png';
import trashCan from '../../../assets/trashCan.png';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { classnames } from '../../utils';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default ({
  trip,
  isShort,
  detailButtonPress,
  deleteTrip,
  index,
  isPicking,
  onPick,
  onPress,
  theme,
}) => {
  const [opacity, setOpacity] = useState(new Animated.Value(1));
  const deleteItem = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      deleteTrip();
      setOpacity(new Animated.Value(1));
    });
  };
  const containerStyle = classnames(
    s.item,
    isShort
      ? { backgroundColor: theme.main + '80' }
      : { opacity, backgroundColor: theme.main + '60' },
  );
  return (
    <Animated.View style={containerStyle}>
      <View style={s.itemContent}>
        <View style={s.mainContent}>
          <FontAwesome5Icon name="calendar-alt" size={s.itemIcon.width} color={theme.text} />
          {/* <Image source={scheduleIcon} style={s.itemIcon} /> */}
          <View style={s.itemInfo}>
            <Text style={{ ...s.itemDate, color: theme.text }}>{trip.date}</Text>
            <View style={s.itemWay}>
              <View style={s.wayIcon}>
                <View style={{ ...s.blueCircle, ...s.bigCircle }} />
                {!isShort && (
                  <>
                    <View style={{ ...s.circle, backgroundColor: theme.text }} />
                    <View style={{ ...s.circle, backgroundColor: theme.text }} />
                    <View style={{ ...s.circle, backgroundColor: theme.text }} />
                  </>
                )}
                <View style={{ ...s.greenCircle, ...s.bigCircle }} />
              </View>
              <View style={s.itemPoints}>
                <Text style={{ ...s.wayText, color: theme.text }}>{trip.fromFetched}</Text>
                <Text style={{ ...s.wayText, ...s.endPoint, color: theme.text }}>
                  {trip.toFound}
                </Text>
              </View>
            </View>
          </View>
          <View style={s.priceContainer}>
            <Text style={{ ...s.price, color: theme.text }}>{trip.price}</Text>
            <FontAwesome5Icon size={s.moneyIcon.width} name="hryvnia" color={theme.text} />
          </View>
        </View>
      </View>
      {!isShort && (
        <>
          <View style={s.itemFooter}>
            <TouchableOpacity
              onPress={() => onPress(trip)}
              style={{ ...s.button, backgroundColor: theme.secondary }}
            >
              <Text style={{ ...s.buttonText, color: theme.text }}>Замовити авто</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Animated.View>
  );
};
