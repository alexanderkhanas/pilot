import React, { useRef, useEffect, useState } from 'react';
import s from './OrderNull.s';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Animated, View, TouchableOpacity, Text } from 'react-native';
import RoundButton from '../../RoundButton/RoundButton';
import { useStore } from '../../../stores/createStore';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default ({
  inputValue,
  isModalVisible,
  submitHandler,
  onInputFocus,
  switchPaymentType,
  paymentType,
  isWrongAddress,
  setPaymentType,
}) => {
  //state
  const [halfContainerWidth, setHalfContainerWidth] = useState(0);
  const left = useRef(new Animated.Value(0)).current;
  const { viewer } = useStore((store) => store);
  const { theme } = viewer;

  //actions

  //effects
  useEffect(() => {
    Animated.timing(left, {
      toValue: paymentType == 'cash' ? 0 : halfContainerWidth,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [paymentType]);
  return (
    <View style={s.container}>
      {/* <View
        style={{
          ...s.placesContainer,
          backgroundColor: theme.background,
          borderColor: theme.secondary,
        }}
      >
        <TouchableOpacity onPress={() => selectPlace('home')} style={s.place}>
          <Text
            style={{
              ...s.placeText,
              color: theme.text,
              borderRightWidth: 2,
              borderRightColor: theme.text,
            }}
          >
            Дім
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => selectPlace('work')} style={s.place}>
          <Text
            style={{
              ...s.placeText,
              color: theme.text,
            }}
          >
            Робота
          </Text>
        </TouchableOpacity>
      </View> */}
      <View style={s.submitContainer}>
        <TouchableOpacity
          disabled={isWrongAddress}
          onPress={() => onInputFocus(true)}
          style={{ ...s.item, backgroundColor: theme.main + '60' }}
        >
          <Text style={{ ...s.itemText, color: theme.text }}>{inputValue}</Text>
        </TouchableOpacity>
        <RoundButton
          disabled={isWrongAddress}
          style={{ ...s.orderCarBtn, backgroundColor: theme.main }}
          onPress={submitHandler}
          text={<Icon name="check" size={hp(4) < 20 ? 20 : hp(4)} color={theme.text} />}
          textStyle={s.orderBtnText}
        />
      </View>
      <TouchableOpacity onPress={() => onInputFocus(true)}>
        <FontAwesome5Icon name="ellipsis-h" size={30} color={theme.text} />
      </TouchableOpacity>
      <View
        style={{ ...s.paymentTypeContainer, backgroundColor: theme.main + '60' }}
        onLayout={({ nativeEvent }) => setHalfContainerWidth(nativeEvent.layout.width / 2)}
      >
        <Animated.View style={{ ...s.coloredContainer, backgroundColor: theme.main, left }} />
        <TouchableOpacity
          style={{
            ...s.item,
          }}
          onPress={() => {
            setPaymentType('cash');
          }}
        >
          <Text style={{ ...s.buttonText, color: theme.text }}>Готівка</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            ...s.item,
          }}
          onPress={() => {
            setPaymentType('card');
          }}
        >
          <Text style={{ ...s.buttonText, color: theme.text }}>Картка</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
