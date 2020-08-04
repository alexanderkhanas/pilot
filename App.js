import React, { useEffect, useState } from 'react';
import { StatusBar, AsyncStorage, PermissionsAndroid, Platform } from 'react-native';
import Navigator from './src/navigation/Navigator';
import { Provider, createStore } from './src/stores/createStore';
import { observer } from 'mobx-react';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import SplashScreen from 'react-native-splash-screen';
import { colorThemes } from './src/styles/global';
import Geolocation from '@react-native-community/geolocation';
import AlertState from './src/context/AlertState';
import { btoa, atob } from 'Base64';
import { Database } from './src/api/api';

const store = createStore();

const App = () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyAH-XHxr1lUiyEmqfZ24pExB-rCg8O8sCs',
    authDomain: 'pilot-taxi-f570e.firebaseapp.com',
    databaseURL: 'https://pilot-taxi-f570e.firebaseio.com',
    projectId: 'pilot-taxi-f570e',
    storageBucket: 'pilot-taxi-f570e.appspot.com',
    messagingSenderId: '623489335153',
    appId: '1:623489335153:web:e6872d7c774b91065cc0d0',
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const getLocationAndroid = async (granted) => {
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      await Geolocation.getCurrentPosition(
        (data) => {
          store.viewer.location.update(data.coords);
        },
        (error) => {
          console.log('error', error);
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        },
      );
    }
  };
  const getLocationIos = async () => {
    const res = await Geolocation.requestAuthorization();
    console.log({ res });
    if (!res) return;
    await Geolocation.getCurrentPosition((data) => {
      store.viewer.location.update(data.coords);
    });
  };
  useEffect(() => {
    (async function () {
      StatusBar.setHidden(true);

      //set theme
      let themeType = await AsyncStorage.getItem('_theme');
      const { setTheme } = store.viewer.theme;
      if (!themeType) {
        await AsyncStorage.setItem('_theme', 'lightTheme');
        themeType = 'lightTheme';
      }
      setTheme(colorThemes[themeType], themeType);
      //set default payment type
      const paymentType = await AsyncStorage.getItem('_paymentType');
      const { cards, viewer } = store;

      const { setPaymentType } = viewer.profile;

      if (paymentType) {
        console.log(paymentType);

        setPaymentType(paymentType);
      }

      //get locations
      if (Platform.OS === 'android') {
        const locationPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ).catch((e) => console.log(e));
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
        if (locationPermission) {
          await getLocationAndroid(locationPermission);
        }
      } else {
        await getLocationIos();
      }
      const authorizationStatus = await messaging().requestPermission();
      console.log('authorizationStatus ===', authorizationStatus);

      if (authorizationStatus) {
        await messaging().registerDeviceForRemoteMessages();
      }

      //autologin
      const hash = await AsyncStorage.getItem('_hash');
      console.log('hash that we got:', hash);
      if (hash) {
        const res = await store.viewer.profile.autoLogin(hash);
        console.log(res);
      } else store.viewer.setLoggedIn(false);
      const _cards = await AsyncStorage.getItem('_cards');
      console.log('_cards', _cards);
      if (_cards) {
        const cardsData = JSON.parse(atob(_cards.split(';__;')[0]));
        const cardsNames = _cards.split(';__;')[1].split(';_;');
        console.log('NAMES', cardsNames);
        const merged = cardsData.map((card, i) => {
          const name = cardsNames[i];
          return { ...card, name };
        });
        console.log(merged);
        cards.setAll(merged);
      }
      SplashScreen.hide();
      console.log('splash hidden');
    })();
  }, []);
  return (
    <Provider value={store}>
      <AlertState>
        <Navigator />
      </AlertState>
    </Provider>
  );
};

export default observer(App);
