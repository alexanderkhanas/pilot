import React, { useEffect, useRef, useState } from 'react';
import s from './AvoidKeyboardView.s';
import { Animated, Easing, View, Keyboard } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default ({ children, style, customValue = 0 }) => {
  const [space, setSpace] = useState(0);
  const padding = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const didShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      const requiredMove = e.endCoordinates.height - space;
      const newPadding = requiredMove > 0 ? requiredMove + 10 : 0;
      const toValue = customValue ? customValue : newPadding;
      Animated.timing(padding, {
        toValue,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    });

    const didHideListener = Keyboard.addListener('keyboardDidHide', (e) => {
      Animated.timing(padding, {
        toValue: 0,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    });
    return () => {
      didShowListener.remove();
      didHideListener.remove();
    };
  }, [space]);

  const onLayout = ({ nativeEvent }) => {
    setSpace(hp(100) - nativeEvent.layout.height);
  };
  children = React.cloneElement(children, { onLayout });

  return (
    <>
      <View
        style={{
          ...s.bgWrapper,
          backgroundColor: style.backgroundColor,
        }}
      />
      <Animated.View style={{ ...s.container, ...style, bottom: padding }}>
        {children}
      </Animated.View>
    </>
  );
};
