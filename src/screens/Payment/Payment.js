import React, { useState, useEffect, useContext, useCallback } from 'react';
import s from './Payment.s';
import { observer } from 'mobx-react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  ScrollView,
  AsyncStorage,
  BackHandler,
} from 'react-native';
import { useStore } from '../../stores/createStore';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Card from '../../components/Card/Card';
import CardInput from '../../components/CardInput/CardInput';
import Api from '../../api';
import AlertModal from '../../components/AlertModal/AlertModal';
import RoundButton from '../../components/RoundButton/RoundButton';
import GestureWrapper from '../../components/GestureWrapper/GestureWrapper';
import Header from '../../components/Header/Header';
import { useKeyboard } from '../../utils';
import { AlertContext } from '../../context/AlertState';
import { useFocusEffect } from '@react-navigation/native';

const cardArray = [
  {
    name: 'Favorite',
    number: '51****4559',
    type: 'visa',
    liqpayToken: '2DFB515626B7341611450DE81E971E948D6F260',
  },
  {
    name: 'SecondFav',
    number: '52****4669',
    type: 'mastercard',
    liqpayToken: '2DFB515626B7341611450DE81E971E948D6F260',
  },
];

const CardPayment = ({ navigation, route }) => {
  //state
  const { cards, viewer } = useStore((store) => store);
  const { theme, profile, order, driver } = viewer;
  const [isCardViewVisible, setCardViewVisible] = useState(false);
  const [creditCardForm, setCreditCardForm] = useState(defaultFormData);
  const { openAlert, Alert } = useContext(AlertContext);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  // const closeModal = () => setAlertVisible(false);

  useKeyboard(
    () => setKeyboardVisible(true),
    () => setKeyboardVisible(false),
  );

  //actions
  const toggleCardView = () => setCardViewVisible(!isCardViewVisible);
  const cardSubmitHandler = (cardString, cardData = {}, type = 'auto') => {
    openAlert({
      title: 'Підтвердіть оплату',
      description: `Ви дійсно хочете провести сплатити суму ${order.amount} гривень, карткою ${cardString}?`,
      buttons: [
        { text: 'Так', onPress: () => doPayment(cardData, type) },
        { text: 'Ні', style: 'cancel' },
      ],
    });
  };

  const onPaid = () => {
    order.clearOrder();
    AsyncStorage.setItem('_orderId', '');
    AsyncStorage.setItem('_orderPayment', '');
  };
  const doPayment = async (cardData = {}, type = 'auto') => {
    if (type === 'auto') {
      const payResponse = await Api.LiqPay.pay(order.amount, cardData, '', '', driver.card);
      console.log(order.amount, driver.number, order.orderId, profile.hash);
      await postResult();
      onPaid();
      return;
    }
    //formatting
    const date = creditCardForm.values.date;
    const card_cvv = creditCardForm.values.cvc;
    const card_exp_month = date.slice(0, 2);
    const card_exp_year = date.slice(2);
    const card = creditCardForm.values.number;
    const name = creditCardForm.values.name;
    const phone = '38' + profile.phoneNumber;

    console.log(creditCardForm);

    const finalCardData = {
      card,
      card_cvv,
      card_exp_year,
      card_exp_month,
      phone,
    };
    const payResponse = await Api.LiqPay.pay(order.amount, finalCardData, '', '', driver.card);
    const isSuccess = true; //TODO: set condition
    if (isSuccess) {
      await postResult();
      setCreditCardForm(defaultFormData);
      navigation.navigate('Головна');
      onPaid();
      console.log({
        cvc: card_cvv,
        number: card,
        date: `${card_exp_month}/${card_exp_year}`,
        name,
      });

      cards.add({ cvc: card_cvv, number: card, date: `${card_exp_month}/${card_exp_year}`, name });
    }
    console.log(payResponse.data);
  };

  const postResult = async () => {
    const resultResponse = await Api.LiqPay.sendResult(
      order.amount,
      driver.number,
      order.orderId,
      profile.hash,
    );
    console.log(resultResponse.data);
  };

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

  useEffect(() => {
    console.log(creditCardForm);
  }, [creditCardForm]);

  return (
    <GestureWrapper {...{ route }} onSwipeRight={navigation.openDrawer}>
      <Header
        title="Оплата"
        back={() => navigation.navigate('Головна')}
        iconRight={<FontAwesome5Icon name="money-bill-wave" size={26} color={theme.text} />}
      />
      <ScrollView style={{ flex: 1 }}>
        <View style={s.container}>
          <Text style={{ ...s.title, color: theme.text }}>До оплати {order.amount} грн.</Text>
          {!isKeyboardVisible && (
            <>
              {cards.all.map((card, i) => (
                <Card
                  {...{ card }}
                  key={i}
                  onCardSelect={() =>
                    cardSubmitHandler(`${card.name} ${card.number}`, {
                      card_token: card.liqpayToken,
                    })
                  }
                />
              ))}
            </>
          )}
          {/* {isCardViewVisible && ( */}
          <View style={s.cardViewContainer}>
            <Text style={{ ...s.description, color: theme.text }}>Оплатити іншою карткою</Text>
            <CardInput form={creditCardForm} setForm={setCreditCardForm} />
            <RoundButton
              onPress={() =>
                cardSubmitHandler(
                  `\n Номер: ${creditCardForm.values.number}\n Дата: ${creditCardForm.values.date}\n CVV/CVC: ${creditCardForm.values.cvc}`,
                  {},
                  'manual',
                )
              }
              text="Оплатити"
              style={
                !creditCardForm.isValid
                  ? { ...s.button, backgroundColor: theme.main + '99' }
                  : s.button
              }
              disabled={!creditCardForm.isValid}
            />
          </View>
          {/* )} */}
          {/* <FontAwesome5Icon
            name={isCardViewVisible ? 'minus-square' : 'plus-square'}
            color={theme.text}
            style={s.icon}
            onPress={toggleCardView}
            size={50}
          /> */}
        </View>
      </ScrollView>
      <Alert />
    </GestureWrapper>
  );
};

const defaultFormData = {
  values: { cvc: '', number: '', date: '', name: '' },
  validation: {
    cvc: {
      isTouched: false,
      isValid: false,
    },
    number: {
      isTouched: false,
      isValid: false,
    },
    date: {
      isTouched: false,
      isValid: false,
    },
    name: {
      isTouched: false,
      isValid: false,
    },
  },
  isValid: false,
};

export default observer(CardPayment);
