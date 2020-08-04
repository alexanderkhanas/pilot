import React, { useState, useEffect } from 'react';
import s from './RateModal.s';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { Animated, View, Text, TouchableOpacity } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useStore } from '../../stores/createStore';
import { observer } from 'mobx-react';
import RoundButton from '../RoundButton/RoundButton';
import Api from '../../api';
import WhiteInput from '../WhiteInput/WhiteInput';
import UnderlineInput from '../UnderlineInput/UnderlineInput';
import { useKeyboard } from '../../utils';

const RateModal = ({ isVisible, cancelTripHandler, closeModal }) => {
  //animation
  const [top] = useState(new Animated.Value(hp(100)));
  const [backgroundIndex] = useState(new Animated.Value(hp(100)));
  const openAnimation = () => {
    Animated.sequence([
      Animated.timing(top, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundIndex, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };
  const closeAnimation = () => {
    Animated.sequence([
      Animated.timing(backgroundIndex, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(top, {
        toValue: hp(100),
        useNativeDriver: false,
        duration: 400,
      }),
    ]).start();
  };
  const backgroundColor = backgroundIndex.interpolate({
    inputRange: [0, 1],
    outputRange: ['#40404000', '#40404080'],
  });

  useEffect(() => {
    if (isVisible) return openAnimation();
    closeAnimation();
  }, [isVisible]);

  //main
  const [rating, setRating] = useState(3);
  const { theme, order, profile, driver } = useStore((store) => store.viewer);
  const [comment, setComment] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useKeyboard(
    () => setKeyboardVisible(true),
    () => setKeyboardVisible(false),
  );
  const rateTrip = () => {
    Api.Order.rate(driver.number, profile.hash, rating * 10, comment);
    closeModal();
  };
  const onCancelPress = () => {
    closeAnimation();
    closeModal();
  };
  return (
    <Animated.View
      style={{
        ...s.container,
        top,
        backgroundColor,
        justifyContent: isKeyboardVisible ? 'flex-start' : 'center',
      }}
    >
      <View style={{ ...s.modal, backgroundColor: theme.anotherMain }}>
        <Text style={{ ...s.title, color: theme.text }}>Замовлення завершене.</Text>
        <Text style={{ ...s.title, color: theme.text }}>Бажаєте оцінити поїздку?</Text>
        <AirbnbRating
          count={5}
          reviews={['Жахливо!', 'Погано', 'Нормально', 'Добре', 'Чудово!']}
          defaultRating={3}
          size={40}
          onFinishRating={(rating) => setRating(rating)}
        />
        <UnderlineInput
          value={comment}
          onChangeText={(text) => setComment(text)}
          style={{ marginTop: 20 }}
          color={theme.text}
          placeholder="Коментар"
        />
        <RoundButton
          onPress={rateTrip}
          text="Оцінити"
          style={{ paddingVertical: hp(1), marginTop: 20 }}
        />
        <TouchableOpacity style={s.cancelButton} onPress={onCancelPress}>
          <Text>Скасувати</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default observer(RateModal);
