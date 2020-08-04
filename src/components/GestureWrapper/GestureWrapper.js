import React, { useEffect, useState, useCallback } from 'react';
import GestureRecognizer from 'react-native-swipe-gestures';
import { AsyncStorage, View, BackHandler, Animated, Alert } from 'react-native';
import { colorThemes } from '../../styles/global';
import { observer } from 'mobx-react';
import { useStore } from '../../stores/createStore';
import { useFocusEffect } from '@react-navigation/native';
import AlertModal from '../AlertModal/AlertModal';

const GestureWrapper = ({ children, onSwipeRight, onSwipeDown, onSwipeLeft, style, route }) => {
  const { theme } = useStore((store) => store.viewer);
  const [opacity] = useState(new Animated.Value(0.7));
  const animation = () => {
    Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };
  useFocusEffect(
    useCallback(() => {
      Alert.alert('Test', 'it is not production build');
      if (!route || route.name === 'Головна') return;
      opacity.setValue(0.7);
      animation();
    }, []),
  );
  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        ...style,
        opacity,
      }}
    >
      {children}
    </Animated.View>
  );
};

export default observer(GestureWrapper);
