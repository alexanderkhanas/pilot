import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import s from './Profile.s';
import {
  View,
  Image,
  Text,
  AsyncStorage,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';
import Header from '../../components/Header/Header';
import GestureWrapper from '../../components/GestureWrapper/GestureWrapper';
import UnderlineInput from '../../components/UnderlineInput/UnderlineInput';
import RoundButton from '../../components/RoundButton/RoundButton';
import { useStore } from '../../stores/createStore';
import { observer } from 'mobx-react';
import { useKeyboard, classnames } from '../../utils';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colorThemes } from '../../styles/global';
import { useFocusEffect } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import CropImageModal from '../../components/CropImageModal/CropImageModal';
import CustomSwitch from '../../components/CustomSwitch/CustomSwitch';
import Api from '../../api';
import Axios from 'axios';
import { AlertContext } from '../../context/AlertState';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const options = {
  title: 'Обрати фото',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  takePhotoButtonTitle: 'Зробити фото',
  chooseFromLibraryButtonTitle: 'Обрати фото з галереї',
  cancelButtonTitle: 'Скасувати',
};

const Profile = ({ navigation, route }) => {
  //state
  const store = useStore();
  const { profile, theme } = useStore((store) => store.viewer);
  const {
    name,
    surname,
    nickname,
    logout,
    updateProfile,
    avatarUri,
    setProfileAvatar,
    defaultPaymentType,
  } = profile;
  const { openAlert, Alert } = useContext(AlertContext);
  const nick = nickname[0] + nickname.slice(1).toLocaleLowerCase();
  const [inputData, setInputData] = useState({
    name,
    surname,
    nickname: nickname[0] + nickname.slice(1).toLocaleLowerCase(),
  });

  const [themeType, setThemeType] = useState(theme.type);
  const [paymentType, setPaymentType] = useState(defaultPaymentType);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useKeyboard(
    () => setKeyboardOpen(true),
    () => setKeyboardOpen(false),
  );
  const [isLoading, setLoading] = useState(false);
  const [btnText, setBtnText] = useState('Оновити');
  const [isCropping, setCropping] = useState(false);
  const valid = Object.values(inputData).every((string) => string.length > 1);
  const buttonStyle = classnames([s.disabled, !valid || btnText !== 'Оновити']);
  const [cropperParams, setCropperParams] = useState();

  //refs

  const cropRef = useRef();

  //actions

  const updateUserDataHandler = async () => {
    // setBtnText('Оновляємо...');
    setLoading(true);
    const res = await updateProfile(inputData.name, inputData.surname, inputData.nickname);
    if (!res) setInputData({ name, surname, nickname: nick });
    setLoading(false);
    // setBtnText(res ? 'Успішно!' : 'Помилка!');
    // setTimeout(() => setBtnText('Оновити'), 1234);
  };

  const inputHandler = (type, value) => setInputData({ ...inputData, [type]: value });

  const askLogout = () => {
    openAlert({
      title: 'Вихід',
      description: 'Ви дійсно хочете вийти із аккаунту?',
      buttons: [
        { text: 'Так', onPress: logout },
        { text: 'Ні', style: 'cancel' },
      ],
    });
  };

  const onSwitchChange = async () => {
    setThemeType((prev) => (prev == 'lightTheme' ? 'darkTheme' : 'lightTheme'));
  };
  const [cropPhoto, setCropPhoto] = useState('');

  const askAvatarChange = () => {
    ImagePicker.showImagePicker(options, (photo) => {
      if (photo.error) Alert.alert('error', 'photo error');
      else if (photo.uri) {
        const source = { uri: photo.uri };
        const format = photo.type === 'image/jpeg' ? 'jpg' : 'png';
        if (!profile.hash) return;
        setCropPhoto({ ...photo, fileName: `${profile.hash}.${format}`, source });
        setCropping(true);
        // data.append('e-image1', {
        //   name: photo.fileName,
        //   type: photo.type,
        //   uri: Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
        // });
        // Api.Image.upload(data);
      }
    });
  };

  const onImageSave = async (photo) => {
    setCropping(false);
    const copyUri = (' ' + photo.uri).slice(1);
    const uri = Platform.OS === 'android' ? copyUri : copyUri.replace('file://', '');
    // const uriObj = { uri };
    store.viewer.profile.setProfileAvatar(uri);
    const image = new FormData();
    image.append('e-image1', {
      name: cropPhoto.fileName,
      type: cropPhoto.type,
      uri,
    });
    AsyncStorage.setItem('_avatar', uri);

    const avatarStatus = await Api.Image.upload(image);
    console.log('avatar res', avatarStatus);
    if (!avatarStatus || avatarStatus != 1) {
      openAlert({
        title: 'Сталась помилка',
        description: 'Помилка при завантаженні фото на сервер',
        buttons: [{ text: 'OK' }],
      });
    }
    // console.log('form', image);
  };

  const themeButtons = [
    {
      type: 'icon',
      icon: 'sun',
      onPress: () => setThemeType('lightTheme'),
      isActive: themeType === 'lightTheme',
      activeColor: theme.text,
      baseColor: theme.text + '99',
    },
    {
      type: 'icon',
      icon: 'moon',
      onPress: () => setThemeType('darkTheme'),
      isActive: themeType === 'darkTheme',
      activeColor: theme.text,
      baseColor: theme.text + '99',
    },
  ];
  const paymentButtons = [
    {
      type: 'icon',
      icon: 'money-bill-wave',
      onPress: () => setPaymentType('cash'),
      isActive: paymentType === 'cash',
      activeColor: theme.text,
      baseColor: theme.text + '99',
    },
    {
      type: 'icon',
      icon: 'credit-card',
      onPress: () => setPaymentType('card'),
      isActive: paymentType === 'card',
      activeColor: theme.text,
      baseColor: theme.text + '99',
    },
  ];

  //effects
  const [img, setImg] = useState();
  useEffect(() => {
    (async () => {
      const response = await Axios.get('https://taxipilot.gotdns.org:449/app/apkevent12.php');
      setImg(response.data);
    })();
  }, []);
  useEffect(() => {
    theme.setTheme(colorThemes[themeType], themeType);
    (async () => {
      await AsyncStorage.setItem('_theme', themeType);
    })();
  }, [themeType]);
  useEffect(() => {
    profile.setPaymentType(paymentType);
    (async () => {
      await AsyncStorage.setItem('_paymentType', `${paymentType}`);
    })();
  }, [paymentType]);
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

  const rowTextStyle = { ...s.rowText, color: theme.text };
  return (
    <GestureWrapper {...{ route }} onSwipeRight={navigation.openDrawer}>
      <Header
        title={'Мій Профіль'}
        back={() => navigation.navigate('Головна')}
        iconRight={<Icon name="sign-out-alt" size={26} onPress={askLogout} color={theme.text} />}
      />

      <View style={{ ...s.container, backgroundColor: theme.background }}>
        <View>
          <View style={{ display: keyboardOpen ? 'none' : 'flex' }}>
            <View style={s.avatarContainer}>
              <TouchableWithoutFeedback onPress={askAvatarChange}>
                {avatarUri ? (
                  <Image style={s.userAvatar} source={{ uri: avatarUri }} />
                ) : (
                  <View
                    style={{ ...s.defaultUserAvatarContainer, backgroundColor: theme.secondary }}
                  >
                    <FontAwesome5Icon
                      name="user"
                      style={s.defaultUserAvatar}
                      color={theme.background}
                      solid
                      size={wp(18)}
                    />
                  </View>
                )}
              </TouchableWithoutFeedback>
            </View>
          </View>
          <CropImageModal
            visible={isCropping}
            {...{ cropPhoto }}
            onSave={onImageSave}
            {...{ setCropperParams }}
            closeModal={() => setCropping(false)}
            keepAspectRatio
            aspectRatio={{ width: 1, height: 1 }}
          />

          <View style={s.userInfoContainer}>
            <View style={s.horizontalInputs}>
              <UnderlineInput
                color={theme.text}
                style={{ ...s.inputStyle, marginRight: 15 }}
                label="Ім'я"
                value={inputData.name}
                containerStyle={{ flex: 1 }}
                borderColor={theme.text}
                onChangeText={(text) => inputHandler('name', text)}
              />
              <UnderlineInput
                color={theme.text}
                style={{ ...s.inputStyle }}
                label="Нікнейм"
                containerStyle={{ flex: 1 }}
                value={inputData.nickname}
                onChangeText={(text) => inputHandler('nickname', text)}
              />
            </View>
            <UnderlineInput
              color={theme.text}
              style={{ ...s.inputStyle }}
              label={'Прізвище'}
              value={inputData.surname}
              onChangeText={(text) => inputHandler('surname', text)}
            />
            <View style={s.row}>
              <Text style={rowTextStyle}>Тема кольорів :</Text>
              <CustomSwitch buttons={themeButtons} />
            </View>
            <View style={s.row}>
              <Text style={rowTextStyle}>Тип оплати :</Text>
              <CustomSwitch buttons={paymentButtons} />
            </View>
            {/* <View style={s.row}>
              <Text style={rowTextStyle}>Важливі місця :</Text>
            </View> */}
          </View>
        </View>
        <View style={s.footerButton}>
          <RoundButton
            onPress={updateUserDataHandler}
            text={btnText}
            style={buttonStyle}
            {...{ isLoading }}
            disabled={!valid || isLoading}
            // disabled={!valid || btnText !== 'Оновити'}
          />
        </View>
      </View>
      <Alert />
    </GestureWrapper>
  );
};

export default observer(Profile);
