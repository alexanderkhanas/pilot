import React from 'react';
import s from './HamburgerButton.s';
import { TouchableOpacity, Image } from 'react-native';
import { useStore } from '../../stores/createStore';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default ({ openDrawer }) => {
  const { theme } = useStore((store) => store.viewer);
  const onPress = () => {
    openDrawer();
  };
  return (
    <TouchableOpacity {...{ onPress }} style={{ ...s.button, backgroundColor: theme.main }}>
      <FontAwesome5Icon size={s.buttonIcon.height} name="bars" color={theme.text} />
    </TouchableOpacity>
  );
};
