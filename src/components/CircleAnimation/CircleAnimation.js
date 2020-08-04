import React, { useRef, useEffect } from 'react';
import s from './CircleAnimation.s';
import { Animated, View, Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';
import { useStore } from '../../stores/createStore';

const window = Dimensions.get('window');

const CircleAnimation = () => {
  const scale = useRef(new Animated.Value(window.height / window.width)).current;
  const { theme } = useStore((store) => store.viewer);
  useEffect(() => {
    Animated.timing(scale, {
      duration: 1200,
      useNativeDriver: false,
      toValue: 0,
    }).start();
  }, []);
  const opacity = scale.interpolate({
    inputRange: [0, 0.4, window.height / window.width],
    outputRange: [0.1, 0.8, 1],
  });
  return (
    <View style={s.container}>
      <Animated.View
        style={{ ...s.circle, transform: [{ scale }], backgroundColor: theme.main, opacity }}
      />
    </View>
  );
};

export default CircleAnimation;
