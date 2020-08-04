// maybe split in files later
import { types as t, getParent, flow } from 'mobx-state-tree';
import { Alert, AsyncStorage, PermissionsAndroid } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Api from '../../api';
import { convertHistoryItem } from '../../utils';
import Geolocation from '@react-native-community/geolocation';

const defaultLocation = {
  latitude: 49.55217271866362,
  longitude: 25.59473343193531,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const ViewerLocationModel = t
  .model('ViewerLocationModel', {
    latitude: 49.55217271866362,
    longitude: 25.59473343193531,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
    isFromUser: false,
  })
  .actions((self) => ({
    update({ latitude, longitude, latitudeDelta, longitudeDelta }) {
      console.log('update', latitude, longitude, latitudeDelta, longitudeDelta);
      if (latitude) self.latitude = latitude;
      if (latitude) self.longitude = longitude;
      if (latitudeDelta) self.latitudeDelta = latitudeDelta;
      if (longitudeDelta) self.longitudeDelta = longitudeDelta;
      self.isFromUser = true;
      return { latitude, longitude, latitudeDelta, longitudeDelta };
    },
    requestLocation: flow(function* requestLocation() {
      // const granted = yield PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.LOCATION, {
      //   title: 'Дозвольте таксі отримувати доступ до вашої геолокації',
      //   message: 'Це потрібно для зручнішого користування додатком',
      //   buttonNeutral: 'Ask Me Later',
      //   buttonNegative: 'Cancel',
      //   buttonPositive: 'OK',
      // });
      const granted = yield PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      console.log('granted', granted);
      let coords;

      // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      yield Geolocation.getCurrentPosition(
        (data) => {
          console.log('data', data.coords);
          coords = data.coords;
          console.log(coords.latitude);
        },
        () => {
          coords = defaultLocation;
        },
      );
      // } else {
      //   // console.log('fucc', rest);
      //   coords = defaultLocation;
      // }
      // const { latitude, longitude, latitudeDelta, longitudeDelta } = coords;
      console.log('coords', coords);
      self.latitude = coords.latitude;
      self.longitude = coords.longitude;
      if (coords.latitudeDelta) {
        self.latitudeDelta = coords.latitudeDelta;
      }
      if (coords.longitudeDelta) {
        self.longitudeDelta = coords.longitudeDelta;
      }

      return { ...self };
    }),
  }));

export const ViewerDelayedOrderModel = t
  .model('ViewerDelayedOrderModel', { date: '', id: '', location: '' })
  .actions((self) => ({
    setData(date, id, location) {
      self.date = date;
      self.id = id;
      self.location = location;
    },
  }));

export const ViewerProfileModel = t
  .model('ViewerProfileModel', {
    name: t.maybeNull(t.string),
    surname: t.maybeNull(t.string),
    nickname: t.maybeNull(t.string),
    phoneNumber: t.maybeNull(t.string),
    vCode: t.maybeNull(t.number),
    userId: t.maybeNull(t.number),
    hash: t.maybeNull(t.string),
    avatarUri: t.maybeNull(t.string),
    defaultPaymentType: 'cash',
  })
  .views((self) => ({
    get fullName() {
      return `${self.surname} ${self.name}`;
    },
  }))
  .actions((self) => ({
    setPaymentType(type) {
      self.defaultPaymentType = type;
    },
    setHash(hash) {
      self.hash = hash;
      AsyncStorage.setItem('_hash', hash);
      console.log('new hash', hash);
    },
    setPhoneNumber(phoneNumber) {
      self.phoneNumber = phoneNumber;
    },
    setBackendData(vCode, userId) {
      if (vCode) self.vCode = vCode;
      if (userId) self.userId = userId;
    },
    setProfileData(name, surname, nickname) {
      if (name) self.name = name;
      if (surname) self.surname = surname;
      if (nickname) self.nickname = nickname;
    },
    setProfileAvatar(uri) {
      self.avatarUri = uri;
    },
    logout() {
      self.name = self.surname = self.nickname = self.phoneNumber = self.vCode = self.userId = self.hash = self.avatarUri = null;
      AsyncStorage.setItem('_hash', '');
      getParent(self).setLoggedIn(false);
    },
    updateProfile: flow(function* updateProfile(name, surname, nickname) {
      const res = yield Api.Viewer.updateProfile(self.hash, `${surname} ${name}`, nickname);
      if (res.data.Blacklist === 1) {
        self.name = name;
        self.surname = surname;
        self.nickname = nickname;
        return true;
      } else return false;
    }),
    autoLogin: flow(function* autoLogin(hash) {
      console.log('autologin start');
      const { data } = yield Api.Auth.autoLogin(hash);
      console.log('autologin end', data.Blacklist);
      if (data.Blacklist == -1) {
        getParent(self).setLoggedIn(false);
        return false;
      }
      if (data.Blacklist === 1) {
        const [surname, name] = data.NAMEP.split(' ');
        self.setProfileData(name, surname, data.NICK);
        self.setPhoneNumber(data.PHONE);
        self.setBackendData(null, data.USERID);
        self.setHash(hash);
        const avatarResponse = yield Api.Viewer.getAvatar(hash);
        console.log('avatarres', typeof avatarResponse.data);
        if (typeof avatarResponse.data === 'string')
          self.setProfileAvatar(`data:image/gif;base64,${avatarResponse.data}`);

        const Viewer = getParent(self);
        const Root = getParent(Viewer);
        yield Root.places.fetch(hash);
        Viewer.setLoggedIn(true);
        return true;
      }
    }),
  }));

export const ViewerOrderModel = t
  .model('OrderModel', {
    orderId: t.maybeNull(t.number),
    status: 'null',
    time: '',
    distance: '',
    fullTime: '',
    fullDistance: '',
    userLatitude: 0,
    userLongitude: 0,
    paymentType: 'cash',
    amount: 0,
    driverLiquidPay: t.maybeNull(t.string),
  })
  .actions((self) => ({
    setOrderId(id) {
      self.orderId = +id;
    },
    setStatus(status) {
      self.status = status;
    },
    setPaymentType(paymentType) {
      self.paymentType = paymentType;
    },
    setTime(time, isFull) {
      const hours = Math.floor(time);
      const minutes = Math.floor(time * 60 - hours * 60);
      self.time = `${hours}:${minutes}`;
      if (isFull) {
        self.fullTime = `${hours}:${minutes}`;
      }
    },
    setDistance(distance, isFull) {
      self.distance = +distance.toFixed(2) + 'км';
      if (isFull) {
        self.fullDistance = +distance.toFixed(2) + 'км';
      }
    },
    clearOrder() {
      self.time = self.fullDistance = self.distance = self.fullTime = self.car = self.color = '';
      self.orderId = null;
      self.status = 'null';
    },
    setCarNumber(number) {
      self.number = number;
    },
    setPaymentData(amount, driverLiquidPay) {
      self.amount = amount;
      self.driverLiquidPay = driverLiquidPay;
    },
    makeOrder: flow(function* (
      NAMEST,
      NAMEHS,
      lt,
      ln,
      info = '',
      tip = 0,
      carLevel,
      paymentType,
      date = '',
      endpoint = '',
      isFuture = '0',
    ) {
      const { profile: p } = getParent(self);
      console.log({ tip, carLevel, paymentType });
      const dataArray = [
        ...[p.nickname, p.hash, p.phoneNumber, NAMEST, NAMEHS, lt, ln],
        ...[info, isFuture, tip, paymentType, carLevel, date, endpoint],
      ];

      console.log({ args: dataArray });

      const { data } = yield Api.Order.new(...dataArray);
      console.log(data);

      if (data.Blacklist === 1) {
        self.userLatitude = lt;
        self.userLongitude = ln;
        self.orderId = data.OrderID;
        return data.OrderID;
      } else {
        console.log('order failed', { data });
        return false;
      }
    }),
  }));
export const ViewerDriverModel = t
  .model('ViewerDriverModel', {
    number: t.maybeNull(t.number),
    liqpay: t.maybeNull(t.string),
    car: t.maybeNull(t.string),
    color: t.maybeNull(t.string),
    card: t.maybeNull(t.string),
  })
  .actions((self) => ({
    setData(number, car, color, card) {
      self.number = +number;
      self.car = car;
      self.color = color;
      self.card = card;
    },
    setToken(token) {
      self.liqpay = token;
    },
  }));
const HistoryItem = t.model('HistoryItem', {
  orderId: t.identifierNumber,
  date: t.string,
  latFrom: t.number,
  lonFrom: t.number,
  latTo: t.number,
  lonTo: t.number,
  price: t.number,
  distance: t.number,
  time: t.number,
  fromFetched: t.string,
  toFound: t.string,
  driverNum: t.number, // wtfnepon?0000
});

export const ViewerHistoryModel = t
  .model('HistoryModel', {
    items: t.optional(t.array(HistoryItem), []),
    fetched: false,
  })
  .actions((self) => ({
    fetchMore: flow(function* fetchMore(hash) {
      // const hash = '03226b3217388b4973ec877a4254f18ce9d8267f4295ae05aeb255a77d6cdaff';
      if (self.items.length === 0) {
        // if no items found and fetched yet - fetch latest 7
        if (self.fetched === true) return false;
        const { data } = yield Api.Order.fetchHistory(hash);
        console.log('data ===', data);

        self.items = data.map(convertHistoryItem); // seems like they're sorted as needed already
        // .sort((a, b) => b.orderId - a.orderId);
        self.fetched = true;
        return data.length;
      } else if (self.items.length % 7 === 0) {
        // if there's no 7 or 14 or 21 etc then some of request returned not 7 trips which means there's no more trips can be fetched
        const oldestId = self.items[self.items.length - 1].orderId;
        console.log('oldestId', oldestId);
        const { data } = yield Api.Order.fetchHistory(hash, oldestId);
        self.items.push(...data.map(convertHistoryItem));
        console.log(data);
        self.fetched = true;
        return data.length;
      } else return false;
    }),
  }));

export const ViewerThemeModel = t
  .model('ThemeModel', {
    main: '',
    anotherMain: '',
    secondary: '',
    anotherSecondary: '',
    text: '',
    background: '',
    rare: '',
    type: '',
    error: '',
  })
  .actions((self) => ({
    setTheme(theme, themeType) {
      Object.keys(theme).forEach((key) => {
        self[key] = theme[key];
      });
      self.type = themeType;
    },
  }));
