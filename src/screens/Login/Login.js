import React, { useState, useRef, useEffect } from 'react';
import { View, Alert, Text, Image } from 'react-native';
import s from './Login.s';
import PhoneNumberInput from '../../components/PhoneNumberInput/PhoneNumberInput';
import Logo from '../../atoms/Logo';
import { classnames, useKeyboard } from '../../utils';
import RoundButton from '../../components/RoundButton/RoundButton';
import { useStore } from '../../stores/createStore';
import AvoidKeyboardView from '../../components/AvoidKeyboardView/AvoidKeyboardView';
import darkImg from '../../../assets/authDark.png';
import lightImg from '../../../assets/authLight.png';

export default ({ navigation }) => {
  const [number, setNumber] = useState('');
  const valid = !number.startsWith('0') && number.length === 9;
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [btnText, setBtnText] = useState('Далі');
  const disabled = !valid || btnText !== 'Далі';
  const [smsTimeouts, setSmsTimeouts] = useState({});
  const [seconds, setSeconds] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  useKeyboard(
    () => setKeyboardVisible(true),
    () => setKeyboardVisible(false),
  );
  const inputRef = useRef();

  const [wasFocused, setWasFocused] = useState(false);
  const onFocus = () => setWasFocused(true);

  const onSubmitEditing = () => {
    if (valid) submitHandler();
  };
  const { run: login, isLoading } = useStore((s) => s.auth.login);
  const { theme } = useStore((s) => s.viewer);

  const smsTimeoutHandler = () => {
    setBtnText('Зачекайте 60 секунд');
    let i = 1;
    const interval = setInterval(() => {
      setBtnText(`Зачекайте ${60 - i} секунд`);
      ++i;
    }, 1000);
    const timeout = setTimeout(() => {
      setBtnText('Далі');
      clearInterval(interval);
      setSmsTimeouts({});
    }, 60000);
    setSmsTimeouts({ interval, timeout });
  };

  const submitHandler = async () => {
    setBtnText('Зачекайте...');
    const isRegistered = await login(`0${number}`);
    if (isRegistered === false) navigation.navigate('Register');
    else if (isRegistered === true) {
      smsTimeoutHandler();
      navigation.navigate('SMS');
    }
    // else return Alert.alert('Ваш аккаунт було заблоковано'); // void returned if user is blacklisted
    setBtnText('Далі');
  };

  // useEffect(() => {
  //   return () => {
  //     clearInterval(smsTimeouts.interval);
  //     clearTimeout(smsTimeouts.timeout);
  //   };
  // });

  const imgSource = theme.type === 'lightTheme' ? lightImg : darkImg;
  const containerStyle = isKeyboardVisible ? { position: 'absolute', bottom: 270 } : {};
  return (
    <View style={{ ...s.container, justifyContent: 'center', backgroundColor: theme.background }}>
      <View style={containerStyle}>
        <PhoneNumberInput
          ref={inputRef}
          style={{
            borderBottomColor: theme.text + 80,
            ...classnames([s.wrongInput, !valid && wasFocused]),
          }}
          value={number}
          onChangeText={(val) => {
            setNumber(val);
          }}
          {...{ onSubmitEditing, onFocus }}
        />
        {smsTimeouts.timeout && (
          <Text style={{ color: '#fff' }}>
            Повторна відправка SMS буде доступна через деякий час.
          </Text>
        )}
        <RoundButton
          style={classnames({ ...s.button, backgroundColor: theme.secondary }, [
            { backgroundColor: theme.main + '99' },
            disabled,
          ])}
          text={btnText}
          {...{ isLoading }}
          onPress={submitHandler}
          textStyle={{ ...s.buttonText, color: theme.text }}
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
