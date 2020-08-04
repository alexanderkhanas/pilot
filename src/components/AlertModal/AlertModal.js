import React, { useState, useEffect } from 'react';
import s from './AlertModal.s';
import { View, Animated, Text, TouchableOpacity, BackHandler } from 'react-native';
import { useStore } from '../../stores/createStore';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { observer } from 'mobx-react';

const AlertModal = ({ alertModalData, closeModal, isVisible }) => {
  const { order, theme } = useStore((store) => store.viewer);
  const { title, description, buttons = [] } = alertModalData;
  const pressHandler = (mainFunc) => {
    closeModal();
    if (mainFunc) mainFunc();
  };
  const [top] = useState(new Animated.Value(hp(100)));
  const [backgroundIndex] = useState(new Animated.Value(0));
  const animation = () => {
    Animated.timing(backgroundIndex, {
      toValue: isVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const backgroundColor = backgroundIndex.interpolate({
    inputRange: [0, 1],
    outputRange: ['#40404000', '#40404080'],
  });

  useEffect(() => {
    // if (!isVisible) setAnimation(false);

    animation();
  }, [isVisible]);
  return !Object.keys(alertModalData).length || !isVisible ? (
    <View />
  ) : (
    <Animated.View style={{ ...s.container, opacity: backgroundIndex, backgroundColor }}>
      <View style={{ ...s.modal, backgroundColor: theme.main }}>
        <Text style={{ ...s.title, color: theme.text }}>{title}</Text>
        <Text style={{ ...s.description, color: theme.text }}>{description}</Text>
        <View
          style={{
            ...s.btnContainer,
          }}
        >
          {buttons.map((button, i) => (
            <TouchableOpacity
              key={i}
              style={{
                ...s.button,
                backgroundColor: button.style === 'cancel' ? '' : theme.secondary,
                flex: button.style === 'cancel' ? 0.75 : 1,
              }}
              onPress={() => pressHandler(button.onPress)}
            >
              <Text style={{ ...s.buttonText, color: theme.text }}>{button.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

export default observer(AlertModal);
