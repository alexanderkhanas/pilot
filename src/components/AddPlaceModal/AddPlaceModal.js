import React, { useState, useEffect } from 'react';
import s from './AddPlaceModal.s';
import { Animated, View, Text } from 'react-native';
import RoundButton from '../RoundButton/RoundButton';
import WhiteInput from '../WhiteInput/WhiteInput';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { Trip } from '../../api/api';
import { useStore } from '../../stores/createStore';

export default ({
  isVisible,
  closeModal,
  data: { hash, uid, IDST, IDHS, NAMEST, NAMEHS, latitude, longitude },
}) => {
  //state
  const [name, setName] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [animValue] = useState(new Animated.Value(hp(100)));
  const { theme } = useStore((store) => store.viewer);
  //actions
  const addTrip = async () => {
    setLoading(true);
    const response = await Trip.post(
      hash,
      Math.floor(Math.random() * 1000),
      IDST,
      IDHS,
      1,
      NAMEST,
      NAMEHS,
      latitude,
      longitude,
      name,
    );
    setLoading(false);
    closeModal();
  };

  //effects
  useEffect(() => {
    animation(isVisible);
  }, [isVisible]);

  //animation
  const animation = () => {
    Animated.timing(animValue, {
      toValue: isVisible ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const opacity = animValue.interpolate({
    inputRange: [0, 0.5, 0.9, 1],
    outputRange: [0, 0.1, 0.4, 1],
  });
  const top = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [hp(100), 0],
  });
  return (
    <Animated.View style={{ ...s.container, top, opacity }}>
      <View style={{ ...s.modal, backgroundColor: theme.anotherMain }}>
        <FontAwesome5Icon
          name="times-circle"
          style={s.closeButton}
          onPress={closeModal}
          color={theme.text}
          size={25}
        />
        <Text style={{ ...s.title, color: theme.text }}>
          Додати адресу {'\n'} {NAMEST} {NAMEHS}?
        </Text>
        <WhiteInput
          label="Введіть назву місця"
          onChangeText={(text) => setName(text)}
          value={name}
          placeholderTextColor="#40404080"
          placeholder="Назва місця"
          style={{ ...s.input, color: '#404040' }}
        />
        <RoundButton onPress={addTrip} {...{ isLoading }} text="Додати" style={s.button} />
      </View>
    </Animated.View>
  );
};
