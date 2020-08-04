import React, { useState, useCallback, useContext } from 'react';
import s from './MyCards.s';
import GestureWrapper from '../../components/GestureWrapper/GestureWrapper';
import Header from '../../components/Header/Header';
import Api from '../../api';
import { useStore } from '../../stores/createStore';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { observer } from 'mobx-react';
import { useFocusEffect } from '@react-navigation/native';
import AuthorizeCard from '../../components/AuthorizeCard/AuthorizeCard';
import CardPayment from '../Payment/Payment';
import AlertModal from '../../components/AlertModal/AlertModal';
import { AlertContext } from '../../context/AlertState';

const Payment = ({ navigation, route }) => {
  const [viewType, setViewType] = useState('auth');
  const { theme } = useStore((store) => store.viewer);
  const { openAlert, Alert } = useContext(AlertContext);
  useFocusEffect(
    useCallback(() => {
      if (route?.params?.type) setViewType(route.params.type);
    }, [route.params]),
  );
  return (
    <GestureWrapper {...{ route }} onSwipeRight={navigation.openDrawer}>
      <Header
        title="Мої картки"
        back={() => navigation.navigate('Головна')}
        iconRight={<FontAwesome5Icon name="money-bill-wave" size={26} color={theme.text} />}
      />
      <AuthorizeCard {...{ openAlert }} {...{ navigation }} />
      <Alert />
    </GestureWrapper>
  );
};

export default observer(Payment);
