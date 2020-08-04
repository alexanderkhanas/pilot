import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import s from './Register.s';
import Logo from '../../atoms/Logo';
import { TextInput } from 'react-native-gesture-handler';
import { classnames, useKeyboard } from '../../utils';
import { useStore } from '../../stores/createStore';
import darkImg from '../../../assets/authDark.png';
import lightImg from '../../../assets/authLight.png';
import RoundButton from '../../components/RoundButton/RoundButton';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { observer } from 'mobx-react';
import CheckBox from '@react-native-community/checkbox';

const isValidField = (value) => value.trim().length > 1;

const Register = ({ navigation }) => {
  const [nameFields, setNamesData] = useState({
    nickname: { value: '', valid: false, wasFocused: false },
    firstName: { value: '', valid: false, wasFocused: false },
    lastName: { value: '', valid: false, wasFocused: false },
  });
  const [imageHeight, setImageHeight] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isAccepted, setAccepted] = useState(false);
  useKeyboard(
    () => setKeyboardVisible(true),
    () => setKeyboardVisible(false),
  );

  const handleNameInputChange = (field, value) => {
    const { firstName, nickname } = nameFields;
    if (field === 'firstName' && firstName.value === nickname.value) {
      const data = { valid: isValidField(value), value };
      setNamesData({ ...nameFields, firstName: data, nickname: data });
    } else {
      setNamesData({
        ...nameFields,
        [field]: { value, valid: isValidField(value) },
      });
    }
  };

  const allNamesValid = Object.values(nameFields).every((o) => o.valid);

  const inputStyles = {};
  Object.entries(nameFields).forEach(([key, val]) => {
    inputStyles[key] = classnames(
      [s.firstNameInput, key !== 'lastName'],
      [s.surnameInput, key === 'lastName'],
      [s.wrongInput, val.wasFocused && !val.valid],
    );
  });

  const onFocus = (fieldName) => {
    if (nameFields[fieldName].wasFocused === true) return;
    setNamesData({
      ...nameFields,
      [fieldName]: { ...nameFields[fieldName], wasFocused: true },
    });
  };

  const { profile, theme } = useStore((s) => s.viewer);
  const { setProfileData } = profile;
  const submitHandler = () => {
    const { firstName, nickname, lastName } = nameFields;
    setProfileData(firstName.value, lastName.value, nickname.value);
    navigation.navigate('SMS');
  };

  const navigateToRights = () => {
    navigation.navigate('AuthRights');
  };

  const secondInputRef = useRef();
  const thirdInputRef = useRef();

  const [logoVisible, setLogoVisible] = useState();
  useKeyboard(
    () => setLogoVisible(false),
    () => setLogoVisible(true),
  );

  const imgSource = theme.type === 'lightTheme' ? lightImg : darkImg;
  const containerStyle = isKeyboardVisible ? { position: 'absolute', bottom: imageHeight } : {};

  return (
    <View style={{ ...s.container, backgroundColor: theme.background }}>
      {/* <Logo style={classnames(s.logo, { display: logoVisible ? 'flex' : 'none' })} /> */}
      <View style={containerStyle}>
        <View style={s.firstNameInputsView}>
          <View style={s.row}>
            {/* <FontAwesome5Icon name="user" size={30} /> */}
            <TextInput
              placeholder="Імя"
              style={{
                ...inputStyles.firstName,
                backgroundColor: theme.anotherMain,
                color: theme.text,
              }}
              placeholderTextColor={theme.text + '90'}
              onChangeText={(val) => handleNameInputChange('firstName', val)}
              value={nameFields.firstName.value}
              onFocus={() => onFocus('firstName')}
              maxLength={14}
              autoFocus
              blurOnSubmit={false}
              onSubmitEditing={() => secondInputRef.current.focus()}
            />
          </View>

          <TextInput
            ref={secondInputRef}
            placeholder="Нікнейм"
            style={{
              ...inputStyles.firstName,
              backgroundColor: theme.anotherMain,
              color: theme.text,
            }}
            placeholderTextColor={theme.text + '90'}
            onChangeText={(val) => handleNameInputChange('nickname', val)}
            value={nameFields.nickname.value}
            onFocus={() => onFocus('nickname')}
            maxLength={14}
            blurOnSubmit={false}
            onSubmitEditing={() => thirdInputRef.current.focus()}
          />
        </View>
        <TextInput
          ref={thirdInputRef}
          placeholder="Прізвище"
          style={{ ...inputStyles.lastName, backgroundColor: theme.anotherMain, color: theme.text }}
          onChangeText={(val) => handleNameInputChange('lastName', val)}
          value={nameFields.lastName.value}
          onFocus={() => onFocus('lastName')}
          placeholderTextColor={theme.text + '90'}
          maxLength={32}
          onSubmitEditing={() => allNamesValid && onSubmit()}
        />
        <View style={s.checkboxContainer}>
          <CheckBox
            value={isAccepted}
            onValueChange={setAccepted}
            tintColors={{ false: theme.text }}
          />
          <Text style={{ ...s.checkboxText, color: theme.text + '90' }}>
            Я прочитав{' '}
            <Text onPress={navigateToRights} style={{ fontWeight: 'bold', color: theme.text }}>
              умови конфіденційності
            </Text>{' '}
            та згідний з їх положеннями.
          </Text>
        </View>
        <RoundButton
          style={classnames({ ...s.button, backgroundColor: theme.secondary }, [
            { backgroundColor: theme.main + '99' },
            !(allNamesValid && isAccepted),
          ])}
          text="Зареєструватись"
          // {...{ isLoading }}
          onPress={submitHandler}
          textStyle={{ ...s.buttonText, color: theme.text }}
          disabled={!(allNamesValid && isAccepted)}
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

export default observer(Register);
