import { digestStringAsync, CryptoDigestAlgorithm as CDA } from 'expo-crypto';
import { Buffer } from 'buffer';
import { Platform, Alert } from 'react-native';
import database from '@react-native-firebase/database';
import AXIOS from './AXIOS';

const urls = {
  payment: 'https://www.liqpay.ua/api/request',
  login: 'https://taxipilot.gotdns.org:449/app/apkevent1.php',
  finalLogin: 'https://taxipilot.gotdns.org:449/app/apkevent2.php',
  newOrder: 'https://taxipilot.gotdns.org:449/app/apkevent5.php',
  profile: 'https://taxipilot.gotdns.org:449/app/apkevent2a.php',
  cancelTrip: 'https://taxipilot.gotdns.org:449/app/apkevent6.php',
  managePlaces: 'https://taxipilot.gotdns.org:449/app/apkevent2b.php',
  history: 'https://taxipilot.gotdns.org:449/app/apkevent4.php',
  getCarCoords: 'https://taxipilot.gotdns.org:449/app/apkevent3.php',
  rate: 'https://taxipilot.gotdns.org:449/app/apkevent7.php',
  firebase: 'https://pilot-taxi-f570e.firebaseio.com/order_status/',
  image: 'https://taxipilot.gotdns.org:449/app/apkevent8.php',
  newLocation: 'https://taxipilot.gotdns.org:449/app/apkevent9.php',
  avatar: 'https://taxipilot.gotdns.org:449/app/apkevent11.php',
  delivery: 'https://taxipilot.gotdns.org:449/app/apkevent12.php',
  map: 'https://nominatim.openstreetmap.org/reverse?format=json&accept-language=uk',
  paymentResult: 'https://taxipilot.gotdns.org:449/app/apkevent14.php',
};

const encodeSignature = (signStr) => {
  return digestStringAsync(CDA.SHA1, signStr, { encoding: 'base64' });
};
const btoa = (string) => Buffer.from(string, 'binary').toString('base64');
const atob = (string) => Buffer.from(string, 'base64').toString();
const qs = (object) => {
  return Object.entries(object)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');
};

const keys = {
  private: 'sandbox_UowEYTY0Ge89EUEFNVyKa3jv5YIPVCbmYHohYy4O',
  public: 'sandbox_i54733563167',
};

const getOS = () => (Platform.OS === 'android' ? 'Android' : 'iOS');

export const LiqPay = {
  getDefaultReq: (actionType) => ({
    public_key: keys.public,
    action: actionType,
    currency: 'UAH',
    version: '3',
    sandbox: '1',
  }),

  async request(reqData) {
    const data = btoa(JSON.stringify(reqData));
    const signature = await encodeSignature(`${keys.private}${data}${keys.private}`);
    const body = qs({ data, signature });
    const cfg = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    const response = await AXIOS.post(urls.payment, body, cfg).catch((e) =>
      console.log('error', e),
    );
    return response;
  },

  async auth(
    cardInfo = { cvc: '', number: '', date: '' },
    phone,
    description = 'Авторизація картки',
    amount = 1,
  ) {
    const liqpayOrderId = this.generateOId();
    const reqData = {
      action: 'auth',
      version: 3,
      phone,
      amount: 1,
      currency: 'USD',
      description: 'description text',
      order_id: liqpayOrderId,
      card: cardInfo.number,
      card_exp_month: cardInfo.date.slice(0, 2),
      card_exp_year: cardInfo.date.slice(2),
      card_cvv: cardInfo.cvc,
      public_key: keys.public,
    };
    console.log('reqData', reqData);
    const res = this.request(reqData);
    return res;
  },

  generateOId() {
    return 'teStTax1_ordeR__@+' + Math.random();
  },

  pay(
    amount,
    cardInfo = {},
    description = "Поїздка таксі 'Пілот'",
    tripId = '16048281',
    receiver_card,
  ) {
    description = unescape(encodeURI(description));
    console.log({ tripId });
    const server_url = `${urls.firebase}${tripId}.json`;
    const order_id = this.generateOId();
    const reqData = {
      ...this.getDefaultReq('p2p'),
      amount,
      description,
      order_id,
      server_url,
      receiver_card: '5168755904535115',
      ...cardInfo,
    };
    console.log('reqData', reqData);
    return this.request(reqData);
  },
  privatPay(amount, description = "Поїздка таксі 'Пілот'") {
    description = unescape(encodeURI(description));
    const order_id = this.generateOId();

    const reqData = { ...this.getDefaultReq('payment_prepare'), amount, description, order_id };

    return this.request(reqData);
  },
  getStatus(liqpayOrderId) {
    const reqData = {
      ...this.getDefaultReq('status'),
      order_id: liqpayOrderId,
    };
    return this.request(reqData);
  },
  async sendResult(CASHE_PAID, SIMNUM, ORDERID, HASHKEY) {
    const response = await AXIOS.post(urls.paymentResult, {
      CASHE_PAID,
      SIMNUM,
      ORDERID,
      HASHKEY,
    });
    return response;
  },
};

const buildBody = (body) => ({ APP_NAME: 'APP', APP_DESC: getOS(), ...body });
export const Auth = {
  login: async (PHONE) => {
    console.log('body ===', buildBody({ PHONE }));

    const response = await AXIOS.post(urls.login, buildBody({ PHONE }));
    return response;
  },

  finalLogin: async (NAMEP, NICKNAME, PHONE, USERID, VCODE, DEVID) => {
    console.log('token in state', DEVID);
    console.log('sms', buildBody({ NAMEP, NICKNAME, PHONE, VCODE, USERID, DEVID }));
    const response = await AXIOS.post(
      urls.finalLogin,
      buildBody({ NAMEP, NICKNAME, PHONE, VCODE, USERID, DEVID }),
    );
    return response;
  },

  async finalRegister(NAMEP, NICKNAME, PHONE, VCODE, USERID = -1, DEVID) {
    const response = await AXIOS.post(
      urls.finalLogin,
      buildBody({ NAMEP, NICKNAME, PHONE, VCODE, USERID, DEVID }),
    );
    console.log(buildBody({ NAMEP, NICKNAME, PHONE, VCODE, USERID, DEVID }));

    console.log('register res', response.data);
    return response;
  },

  autoLogin: async (HASHKEY) => {
    const response = await AXIOS.post(
      urls.profile,
      buildBody({ HASHKEY, ACTION: 'LOAD', NICKNAME: '', NAMEP: '', LIQPAY: '' }),
    );
    console.log(
      'body:',
      buildBody({ HASHKEY, ACTION: 'LOAD', NICKNAME: '', NAMEP: '', LIQPAY: '' }),
    );
    console.log(response.data);
    return response;
  },
};

export const Order = {
  async new(
    NICKNAME, // user nickname
    HASHKEY, // token
    PHONE, // phone number
    NAMEST, // street name(e.g. "Київська")
    NAMEHS, // house name(e.g. "9A")
    LATITUDE,
    LONGITUDE,
    ADDON_INFO = '',
    FUTURE_ORDER = '0', // is order future?
    CASHE_OVER = 0, // tip
    CASHE_TYPE = 0,
    CAR_TYPE = '',
    FUTURE_DATE = '',
    ROUTE_TO = '',
    IDST = 0,
    IDHS = 0,
  ) {
    /*            CITY ID  CITY NAME            FLAT?       під'їзд?      city shortname(Тернопіль - null) */
    const idk = { IDNP: 1, NAMENP: 'Тернопіль', NAMEKV: '', NAMEENTR: '', SHORTNAME: '' };

    const body = buildBody({
      ...idk,
      ...{ NICKNAME, HASHKEY, PHONE, LATITUDE, LONGITUDE, NAMEST, NAMEHS },
      ...{ ADDON_INFO, FUTURE_ORDER, FUTURE_DATE, CASHE_OVER, CASHE_TYPE, CAR_TYPE },
      ...{ FUTURE_DATE, ROUTE_TO, IDST, IDHS },
    });
    const response = await AXIOS.post(urls.newOrder, body);
    return response;
  },
  async newDelivery(formData) {
    return AXIOS.post(urls.delivery, formData);
  },

  fetchHistory: (HASHKEY, ORDERID = 0) => AXIOS.post(urls.history, buildBody({ HASHKEY, ORDERID })),
  cancel: async (ORDERID, HASHKEY, ACTION = -1) => {
    const response = await AXIOS.post(urls.cancelTrip, buildBody({ HASHKEY, ORDERID, ACTION }));
    console.log('cancelres', response.data);
  },

  async startGettingCoords(HASHKEY, ORDERID, setCoords) {
    const interval = setInterval(async () => {
      const { data } = await AXIOS.post(urls.getCarCoords, buildBody({ HASHKEY, ORDERID }));
      console.log('data', data);
      if (data.LATITUDE && data.LONGITUDE) {
        setCoords({ latitude: +data.LATITUDE, longitude: +data.LONGITUDE });
      }
    }, 5000);
    console.log({ interval });
    this.interval = interval;
  },
  stopGettingCoords() {
    clearInterval(this.interval);
  },
  async rate(SIMNUM, HASHKEY, RATING, COMMENT = '') {
    const response = await AXIOS.post(urls.rate, buildBody({ HASHKEY, RATING, COMMENT, SIMNUM }));
  },
  async setNewLocation(HASHKEY, ORDERID, LATITUDE, LONGITUDE) {
    const response = await AXIOS.post(
      urls.newLocation,
      buildBody({ HASHKEY, ORDERID, LATITUDE, LONGITUDE }),
    );
  },
};

export const Database = {
  async sendStatus(orderId, status) {
    await AXIOS.post(`${urls.firebase}/${orderId}.json`, {
      STATUS: status,
    });
  },
  async getOrderData(orderId = 16357645, callback) {
    console.log(`${urls.firebase}16357645.json`);

    const res = await AXIOS.get(`${urls.firebase}16357645.json`);
    return res?.data;
  },
  async read(orderId, callback) {
    console.log({ orderId });
    this.orderRef = database().ref(`/order_status/${orderId}`);
    database()
      .ref(`/order_status/${+orderId}`)
      .on('child_added', (snapshot) => {
        callback(snapshot);
      });
    Alert.alert('_orderId', orderId);
  },
  stopReading(orderId) {
    database().ref(`/order_status/${orderId}`).off();
  },
};

export const Viewer = {
  updateProfile(HASHKEY, NAMEP, NICKNAME) {
    return AXIOS.post(urls.profile, buildBody({ HASHKEY, NAMEP, NICKNAME, ACTION: 'SAVE' }));
  },
  async getAvatar(HASHKEY) {
    return AXIOS.post(urls.avatar, buildBody({ HASHKEY }));
  },
};

export const Place = {
  async get(hashkey, callback) {
    const response = await AXIOS.post(urls.managePlaces, {
      HASHKEY: hashkey,
      LAT: '',
      APP_NAME: 'APP',
      LON: '',
      IDST: 0,
      NAMEST: 0,
      IDHS: 0,
      NAMEHS: 0,
      SHNAME: '',
      ADDON_INFO: '',
      NAMEKV: '',
      UID: 0,
      APP_DESC: getOS(),
      NAMEENTR: '',
      ACTION: 'LOAD',
    });
    console.log('body ===', {
      HASHKEY: hashkey,
      LAT: '',
      APP_NAME: 'APP',
      LON: '',
      IDST: 0,
      NAMEST: 0,
      IDHS: 0,
      NAMEHS: 0,
      SHNAME: '',
      ADDON_INFO: '',
      NAMEKV: '',
      UID: 0,
      APP_DESC: getOS(),
      NAMEENTR: '',
      ACTION: 'LOAD',
    });

    console.log('response ====', response.data);

    return callback(response);
  },
  async post(
    HASHKEY, // token
    UID,
    IDST, // street id
    IDHS, // house id
    IDNP = 1,
    NAMEST, // street name(e.g. "Київська")
    NAMEHS, // house name(e.g. "9A")
    LAT,
    LON,
    SHNAME = '',
    ADDON_INFO = '',
    NAMEKV = '',
    FAVNAME = '',
    NAMEENTR = '',
  ) {
    console.log(
      'build body ===',
      buildBody({
        ACTION: 'SAVE',
        HASHKEY,
        UID,
        IDST,
        IDHS,
        IDNP,
        NAMEST,
        NAMEHS,
        NAMEENTR,
        NAMEKV,
        LAT,
        LON,
        ADDON_INFO,
        SHNAME,
        FAVNAME,
      }),
    );

    return await AXIOS.post(
      urls.managePlaces,
      buildBody({
        ACTION: 'SAVE',
        HASHKEY,
        UID,
        IDST,
        IDHS,
        IDNP,
        NAMEST,
        NAMEHS,
        NAMEENTR,
        NAMEKV,
        LAT,
        LON,
        ADDON_INFO,
        SHNAME,
        FAVNAME,
      }),
    );
  },
  async delete(HASHKEY, UID) {
    const defaultFields = {
      IDST: 0, // street id
      IDHS: 0, // house id
      IDNP: 0,
      NAMEST: '', // street name(e.g. "Київська")
      NAMEHS: '', // house name(e.g. "9A")
      LAT: '',
      LON: '',
      SHNAME: '',
      ADDON_INFO: '',
      NAMEENTR: '',
      NAMEKV: '',
      ACTION: 'DELETE',
    };
    const response = await AXIOS.post(
      urls.managePlaces,
      buildBody({ ...defaultFields, HASHKEY, UID }),
    );
  },
};

export const Address = {
  async getByCoords(lat, lon) {
    const response = await AXIOS.post(`${urls.map}&lat=${lat}&lon=${lon}`);
    const { address } = response.data;
    let isWrong = false;
    if (address.state !== 'Тернопільська область') isWrong = true;
    let addressParts = getCorrectParts(address);
    if (!addressParts.length) isWrong = true;
    return {
      display: !isWrong ? addressParts.join(', ') : 'Невірна адреса',
      isWrong,
      NAMEST: addressParts[0],
      NAMEHS: addressParts[1],
    };
  },
};

export const Image = {
  async upload(image, type = 'profile') {
    if (type !== 'profile') {
      //here will be logic for delivery images upload
      return;
    }
    const response = await AXIOS.post(urls.image, image);
    return response.data.BLACKLIST;
  },
};

function getCorrectParts(address) {
  let parts = [];
  const {
    city = '',
    house_number = '',
    road = '',
    village = '',
    state = '',
    town = '',
    pedestrian = '',
    nature_reserve = '',
    neighbourhood = '',
    county = '',
  } = address;
  if (city) parts = [road || nature_reserve, house_number || pedestrian || neighbourhood];
  else if (village) parts = [village, road || county];
  else parts = [town, road || county];
  return parts.filter((el) => !!el);
}
