import React, { useEffect, useCallback } from 'react';
import s from './MyBonuses.s';
import GestureWrapper from '../../components/GestureWrapper/GestureWrapper';
import Header from '../../components/Header/Header';
import { Text, View, TouchableOpacity, BackHandler } from 'react-native';
import axios from 'axios';
import { useStore } from '../../stores/createStore';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { observer } from 'mobx-react';
import { useFocusEffect } from '@react-navigation/native';

const Bonuses = ({ navigation, route }) => {
  const { theme } = useStore((store) => store.viewer);
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Головна');
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );
  return (
    <GestureWrapper {...{ route }} onSwipeRight={navigation.openDrawer}>
      <Header
        title="Мої бонуси"
        back={() => navigation.navigate('Головна')}
        iconRight={<FontAwesome5Icon name="gift" size={22} color={theme.text} />}
      />
      <View style={s.container}>
        <Text style={s.bonusesText}>У вас немає бонусів :(</Text>
        <Text style={{ ...s.enterPromoText, color: theme.text }}>Введіть промокод</Text>
        <Text style={{ ...s.promoCode, color: theme.text }}>wrf362</Text>

        <TouchableOpacity style={s.button}>
          <Text style={s.buttonText}>Отримати</Text>
        </TouchableOpacity>

        <View style={{ ...s.birthdayView, backgroundColor: theme.main }}>
          <Text style={{ ...s.birthdayText, color: theme.text }}>
            У Вас сьогодні День Народження? Ми даруємо вам 1 безкоштовну* поїздку!
          </Text>
          <Text style={{ ...s.birthdayNote, color: theme.text }}>
            * При собі необхідно мати документ, що посвідчує особу
          </Text>
        </View>
      </View>
    </GestureWrapper>
  );
};

export default observer(Bonuses);
