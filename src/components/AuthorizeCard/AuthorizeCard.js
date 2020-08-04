import React, { useState, useEffect } from 'react';
import s from './AuthorizeCard.s';
import RoundButton from '../RoundButton/RoundButton';
import CheckBox from '@react-native-community/checkbox';
import { View, Text, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { observer } from 'mobx-react';
import { useKeyboard } from '../../utils';
import { useStore } from '../../stores/createStore';
import { LiqPay } from '../../api/api';
import CardInput from '../CardInput/CardInput';
import Card from '../Card/Card';
import Api from '../../api';

const AuthorizeCard = ({ openAlert }) => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isConfirmed, setConfirmed] = useState(false);
  const [isAccepted, setAccepted] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [creditCardForm, setCreditCardForm] = useState(defaultFormData);
  const { viewer, cards } = useStore((store) => store);
  const { theme, profile } = viewer;
  useKeyboard(
    () => setKeyboardVisible(true),
    () => setKeyboardVisible(false),
  );

  const openInfoAlert = () => {
    openAlert({
      title: 'Про автентифікацію',
      description:
        "Автентифікація потрібна для оплати з авторизованої карти клієнта без вручного введення ним даних, ця процедура не є обов'язковою.",
      buttons: [{ text: 'Ок' }],
    });
  };

  const askAuthCard = () => {
    openAlert({
      title: 'Підтвердіть авторизацію',
      description: `Ви дійсно хочете авторизувати картку ${creditCardForm.values.number}`,
      buttons: [
        {
          text: 'Так',
          onPress: async () => {
            await authCard();
          },
        },
        { text: 'Ні', style: 'cancel' },
      ],
    });
  };
  const authCard = async () => {
    const { cvc, number, date, name } = creditCardForm.values;
    const isNameRegistered = !!cards.all.filter((card) => card.name === name).length;
    const isNumberRegistered = !!cards.all.filter((card) => card.number === number).length;
    if (isNumberRegistered) {
      openAlert({
        title: `Картка вже зареєстрована.`,
        description: `Картка з номером ${number} вже існує.`,
        buttons: [{ text: 'ОК' }],
      });
      return;
    }
    if (isNameRegistered) {
      openAlert({
        title: `Оберіть іншу назву`,
        description: `Картка з назвою ${name} вже існує.`,
        buttons: [{ text: 'ОК' }],
      });
      return;
    }
    setLoading(true);
    const authResponse = await Api.LiqPay.auth({ cvc, number, date });
    if (authResponse.data.result === 'ok') {
      openAlert({
        title: 'Авторизація проведена успішно',
        description: 'Авторизація картки пройшла успішно',
        buttons: [{ text: 'ОК' }],
      });
    }
    setCreditCardForm(defaultFormData);
    cards.add({ cvc, number, date, name });
    setLoading(false);
  };

  const deleteCard = async (id) => {
    cards.delete(id);
  };

  useEffect(() => {
    console.log('cards', cards.all);
  }, []);

  return isConfirmed ? (
    <ScrollView
      style={{
        ...s.scroll,
        // justifyContent: isKeyboardVisible ? 'flex-start' : 'center',
      }}
    >
      <View style={s.container}>
        {!isKeyboardVisible && (
          <>
            <Text style={{ ...s.description, color: theme.text }}>Авторизовані картки</Text>
            {cards.all.length ? (
              cards.all.map((card, i) => <Card {...{ deleteCard }} {...{ card }} key={i} />)
            ) : (
              <Text style={{ ...s.emptyMessage, color: theme.text + '80' }}>
                Ви не авторизували жодної картки
              </Text>
            )}
          </>
        )}
        <Text style={{ ...s.description, ...s.registerLabel, color: theme.text }}>
          Зареєструвати
        </Text>
        <CardInput form={creditCardForm} setForm={setCreditCardForm} />
        <RoundButton
          onPress={askAuthCard}
          text="Авторизувати картку"
          style={
            !creditCardForm.isValid
              ? { ...s.button, backgroundColor: theme.anotherMain + '80' }
              : s.button
          }
          disabled={!creditCardForm.isValid}
        />
      </View>
    </ScrollView>
  ) : (
    <View style={s.container}>
      <FontAwesome5Icon
        name="info-circle"
        size={50}
        color={theme.text}
        style={s.infoIcon}
        onPress={openInfoAlert}
      />
      <Text style={{ ...s.alertMessage, color: theme.text }}>
        Авторизація банківської карти на сервісі LiquidPay потребує разової сплати суми до 1$.
      </Text>
      <TouchableWithoutFeedback>
        <View style={s.checkboxContainer}>
          <CheckBox
            value={isAccepted}
            onValueChange={setAccepted}
            tintColors={{ false: theme.text }}
          />
          <Text style={{ ...s.checkboxText, color: theme.text + '90' }}>
            Я прочитав попереднє повідомлення та згідний з умовами.
          </Text>
        </View>
      </TouchableWithoutFeedback>
      <RoundButton
        onPress={() => setConfirmed(true)}
        text="Підтвердити"
        style={
          !isAccepted
            ? { ...s.confirmButton, backgroundColor: theme.main + '99' }
            : { ...s.confirmButton }
        }
        {...{ isLoading }}
        disabled={!isAccepted}
      />
    </View>
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

export default observer(AuthorizeCard);
