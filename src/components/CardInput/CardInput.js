import React, { useRef, useEffect, useState } from 'react';
import s from './CardInput.s';
import { observer } from 'mobx-react';
import RoundButton from '../RoundButton/RoundButton';
import { useStore } from '../../stores/createStore';
import { TextInputMask } from 'react-native-masked-text';
import { View, Text, ScrollView, Keyboard, TextInput } from 'react-native';
import moment from 'moment';

const CardInput = ({ onChange, form, setForm, ...rest }) => {
  //store
  const { theme } = useStore((store) => store.viewer);
  //ref
  let dateInputRef;
  let cvcInputRef;
  const nameInputRef = useRef();

  //state
  const { values, validation } = form;
  const isNumberCorrect = !validation.number.isTouched || validation.number.isValid;
  const isDateCorrect = !validation.date.isTouched || validation.date.isValid;
  const isCvcCorrect = !validation.cvc.isTouched || validation.cvc.isValid;

  //actions
  const onCardInputChange = (value, type) => {
    let isValueValid = false;
    switch (type) {
      case 'number':
        value = value.replace(/ /g, '');
        const cardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
        isValueValid = cardRegex.test(value) && value.length === 16;
        break;
      case 'date':
        value = value.replace('/', '');
        const year = value.slice(2);
        const month = value.slice(0, 2);
        const inputDate = moment(`${month}/20${year}`, 'MM-YYYY').valueOf();
        const minMonth = 1;
        const maxMonth = 12;
        const minYear = `${moment().year()}`.slice(2);
        const maxYear = `${moment().add(5, 'years').year()}`.slice(2);
        const isDateCorrect =
          month >= minMonth &&
          month <= maxMonth &&
          year >= minYear &&
          year <= maxYear &&
          inputDate > new Date();
        isValueValid = value.length === 4 && isDateCorrect;
        break;
      case 'cvc':
        isValueValid = value.length === 3 && !Number.isNaN(value);
        break;
      case 'name':
        isValueValid = !!value.length;
        break;
      default:
        break;
    }
    console.log('form2', form);
    const validationArray = Object.keys(form.validation).map((el, i) => {
      if (el === type && isValueValid) return type;
      if (form.validation[el].isValid) return el;
    });
    const isFormValid = validationArray.filter((el) => !!el).length === 4;
    const formData = {
      values: { ...form.values, [type]: value },
      validation: {
        ...form.validation,
        [type]: { isValid: isValueValid, isTouched: true },
      },
      isValid: isFormValid,
    };
    setForm(formData);
  };

  const switchToDateInput = () => dateInputRef._inputElement.focus();
  const switchToCvvInput = () => cvcInputRef._inputElement.focus();
  const switchToNameInput = () => nameInputRef.current.focus();

  useEffect(() => {
    console.log('form', form);
  }, [form]);
  // useEffect(() => {
  //   console.log('test ref', testRef._inputElement.focus);
  // }, [testRef]);
  return (
    <View style={s.container}>
      <Text style={{ ...s.label, color: theme.text }}>Номер карти</Text>
      <TextInputMask
        type="credit-card"
        placeholder="1111-1111-1111-1111"
        onChangeText={(value) => onCardInputChange(value, 'number')}
        blurOnSubmit={false}
        value={values.number}
        returnKeyType="next"
        placeholderTextColor={theme.text + '99'}
        onSubmitEditing={switchToDateInput}
        style={{
          ...s.input,
          borderBottomColor: theme.text,
          color: theme.text,
          borderBottomColor: isNumberCorrect ? theme.text : theme.error,
        }}
      />
      <View style={s.row}>
        <View style={{ ...s.group }}>
          <Text style={{ ...s.label, color: theme.text }}>Дата</Text>
          <TextInputMask
            type="custom"
            options={{
              mask: '99/99',
            }}
            ref={(ref) => (dateInputRef = ref)}
            onSubmitEditing={switchToCvvInput}
            placeholder="01/23"
            keyboardType="number-pad"
            blurOnSubmit={false}
            onChangeText={(value) => onCardInputChange(value, 'date')}
            placeholderTextColor={theme.text + '99'}
            returnKeyType="next"
            value={values.date}
            style={{
              ...s.input,
              borderBottomColor: theme.text,
              color: theme.text,
              borderBottomColor: isDateCorrect ? theme.text : theme.error,
            }}
          />
        </View>
        <View style={{ ...s.group }}>
          <Text style={{ ...s.label, color: theme.text }}>CVC</Text>
          <TextInputMask
            type="custom"
            options={{
              mask: '999',
            }}
            keyboardType="number-pad"
            blurOnSubmit={false}
            returnKeyType="next"
            ref={(ref) => (cvcInputRef = ref)}
            onSubmitEditing={switchToNameInput}
            placeholder="111"
            onChangeText={(value) => onCardInputChange(value, 'cvc')}
            blurOnSubmit={false}
            placeholderTextColor={theme.text + '99'}
            value={values.cvc}
            style={{
              ...s.input,
              borderBottomColor: theme.text,
              color: theme.text,
              borderBottomColor: isCvcCorrect ? theme.text : theme.error,
            }}
          />
        </View>
      </View>
      <Text style={{ ...s.label, color: theme.text }}>Назва картки</Text>
      <TextInput
        style={{
          ...s.input,
          color: theme.text,
          borderBottomColor: theme.text,
          marginBottom: 20,
        }}
        ref={nameInputRef}
        onChangeText={(value) => onCardInputChange(value, 'name')}
        value={values.name}
        onSubmitEditing={Keyboard.dismiss}
        placeholderTextColor={theme.text + '99'}
        placeholder="Моя картка"
      />
    </View>
  );
};

export default observer(CardInput);
