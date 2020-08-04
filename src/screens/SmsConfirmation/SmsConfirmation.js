import React, { useState, useEffect, useRef } from 'react';
import s from './SmsConfirmation.s';
import { View, Alert, AsyncStorage, Image, TextInput } from 'react-native';
import Logo from '../../atoms/Logo';
import WhiteInput from '../../components/WhiteInput/WhiteInput';
import RoundButton from '../../components/RoundButton/RoundButton';
import { classnames, useKeyboard } from '../../utils';
import { useStore } from '../../stores/createStore';
import { observer } from 'mobx-react';
import messaging from '@react-native-firebase/messaging';
import darkImg from '../../../assets/authDark.png';
import lightImg from '../../../assets/authLight.png';
import SmsListener from 'react-native-android-sms-listener';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const SmsConfirmation = ({ route }) => {
  const store = useStore();
  const { auth, viewer, places } = store;
  const [value, setValue] = useState('');
  const inputHandler = (text) => setValue(text);
  const { theme } = viewer;
  const shouldSubmit = useRef(false);
  const [btnText, setBtnText] = useState('Підтвердити');
  const [imageHeight, setImageHeight] = useState(0);

  const submitHandler = async () => {
    const {
      profile: { fullName, nickname, phoneNumber, vCode, userId, hash },
    } = viewer;

    setBtnText('Зачекайте...');
    const token = await messaging().getToken();
    console.log('firebaseToken', token);
    if (userId === -1) {
      if (+value === vCode) {
        const res = await auth.finalRegister.run(fullName, nickname, phoneNumber, vCode, -1, token);
        if (res === true) {
          await places.fetch(hash);
          viewer.setLoggedIn(true);
        } else Alert.alert('Сталася помилка...', 'Будь ласка, попробуйте ще раз');
      } else {
        Alert.alert('Невірний код', 'Перевірте правильність вводу');
      }
    } else {
      const res = await auth.finalLogin.run(phoneNumber, +value, fullName, nickname, token);
      console.log('res login', res);
      if (res === true) viewer.setLoggedIn(true);
      else Alert.alert('Невірний код', 'Перевірте правильність вводу');
    }
    setBtnText('Підтвердити');
  };

  const disabled = value.length !== 4 || isNaN(value) || btnText !== 'Підтвердити';
  useEffect(() => {
    const subscription = SmsListener.addListener(({ originatingAddress: sender, body }) => {
      console.log(body);
      if (body.length === 4 && !isNaN(body)) {
        setValue(body);
        shouldSubmit.current = true;
      }
    });

    return () => subscription.remove();
  }, []);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useKeyboard(
    () => setKeyboardVisible(true),
    () => setKeyboardVisible(false),
  );
  useEffect(() => {
    if (shouldSubmit.current === true) {
      submitHandler();
      shouldSubmit.current = false;
    }
  }, [value]);

  const imgSource = theme.type === 'lightTheme' ? lightImg : darkImg;
  const containerStyle = isKeyboardVisible ? { position: 'absolute', bottom: imageHeight } : {};
  return (
    <View style={{ ...s.container, backgroundColor: theme.background }}>
      <View style={containerStyle}>
        <View style={s.row}>
          <FontAwesome5Icon color={theme.text} name="sms" size={30} />
          <TextInput
            placeholder="Введіть код з СМС"
            value={value}
            onChangeText={inputHandler}
            style={{ ...s.input, color: theme.text }}
            placeholderTextColor={theme.text + '80'}
            keyboardType="numeric"
            onSubmitEditing={submitHandler}
            maxLength={4}
          />
        </View>

        <RoundButton
          style={classnames({ ...s.button, backgroundColor: theme.secondary }, [
            { backgroundColor: theme.main + '99' },
            disabled,
          ])}
          text={btnText}
          isLoading={auth.finalRegister.isLoading || auth.finalLogin.isLoading}
          onPress={submitHandler}
          textStyle={s.buttonText}
          disabled={disabled}
        />
      </View>
      {!isKeyboardVisible && (
        <Image
          onLayout={({ nativeEvent }) => setImageHeight(nativeEvent.layout.height)}
          source={imgSource}
          style={s.image}
        />
      )}
    </View>
  );
};

export default observer(SmsConfirmation);
