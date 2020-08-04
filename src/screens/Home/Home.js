import React, { useRef, useEffect, useState, useCallback, useContext } from 'react';
import {
  View,
  Platform,
  Linking,
  BackHandler,
  AsyncStorage,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import s from './Home.s';
import Map from '../../components/Map/Map';
import BookAutoModal from '../../components/BookAutoModal/BookAutoModal';
import HamburgerButton from '../../components/HamburgerButton/HamburgerButton';
import { useStore } from '../../stores/createStore';
import { useKeyboard } from '../../utils';
import { observer } from 'mobx-react';
import { getDistanceFromLatLonInKm } from '../../utils';
import OrderNull from '../../components/HomeOrder/OrderNull/OrderNull';
import OrderSearch from '../../components/HomeOrder/OrderSearch/OrderSearch';
import OrderComing from '../../components/HomeOrder/OrderComing/OrderComing';
import OrderConfirmed from '../../components/HomeOrder/OrderConfirmed/OrderConfirmed';
import OrderWaiting from '../../components/HomeOrder/OrderWaiting/OrderWaiting';
import { Order, Database, Address } from '../../api/api';
import Api from '../../api';
import { useFocusEffect } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import RateModal from '../../components/RateModal/RateModal';
import { AlertContext } from '../../context/AlertState';
import CircleAnimation from '../../components/CircleAnimation/CircleAnimation';
import OrderWithClient from '../../components/HomeOrder/OrderWithClient/OrderWithClient';

const Home = ({ route, navigation }) => {
  navigation.setOptions({
    gesturesEnabled: false,
  });
  //store
  const { viewer, places } = useStore((store) => store);
  const { location, order, profile, theme, driver } = viewer;
  const { openAlert, Alert, isAlertVisible } = useContext(AlertContext);
  //state
  const [isAlertPrimary, setAlertPrimary] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [marker, setMarker] = useState(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isCarVisible, setCarVisible] = useState(false);
  const [nextCarPosition, setNextCarPosition] = useState(null);
  const [userLocation, setUserLocation] = useState();
  const [inputValue, setInputValue] = useState('');
  const [modalType, setModalType] = useState('taxi');
  const [modalPickMode, setModalPick] = useState(0);
  const [locationData, setLocationData] = useState({
    latitude: '',
    longitude: '',
    isWrong: true,
    display: '',
  });
  const [locationWatchId, setLocationWatchId] = useState();
  const [isRateModalVisible, setRateModalVisible] = useState(false);
  const [paymentType, setPaymentType] = useState(profile.defaultPaymentType);
  const [isUpdatingLocation, setUpdatingLocation] = useState(false);
  const [endpoint, setEndpoint] = useState({ val: '' });
  const [isAnimation, setAnimation] = useState(false);
  const [backHandler, setBackHandler] = useState(null);
  // const toggleEndpoint = () => setEndpoint({ ...endpoint, active: !endpoint.active })
  const switchPaymentType = () => setPaymentType(paymentType === 'cash' ? 'card' : 'cash');
  const setEndpointVal = (val) => setEndpoint({ ...endpoint, val });

  //reference
  const mapRef = useRef(null);
  const [isDrawerOpened, setDrawerOpened] = useState(false);

  //keyboard
  const keyboardDidShow = () => setKeyboardVisible(true);
  const keyboardDidHide = () => setKeyboardVisible(false);
  useKeyboard(keyboardDidShow, keyboardDidHide);

  //actions
  const animateToRegion = async () => {
    setUserLocation(location);
    let { latitude, longitude } = location;
    const address = await Address.getByCoords(latitude, longitude);
    console.log('home address', address, address.display);
    setLocationData({ latitude, longitude, ...address });
    // const street = findClosestStreet(location.latitude, location.longitude);
    // setLocationHandler(location, street);
    mapRef.current?.animateToRegion(location, 1000);
  };

  const selectPlace = (type) => {
    console.log('places ===', places);

    const place = places[type] ? JSON.parse(places[type]) : null;
    if (!place) {
      places.setPickingType(type);
      navigation.navigate('Мої місця');
      return;
    }
    console.log('selectedplace', place);
    const { LAT: latitude, LON: longitude } = place;
    setLocationData({ ...locationData, latitude, longitude });
    animateMap({ ...locationData, latitude, longitude });
    onMapClick({ nativeEvent: { coordinate: { ...locationData, latitude, longitude } } });
  };

  const centerMapByUser = async () => {
    animateMap(userLocation);
  };

  const animateMap = async (coords) => {
    const camera = await mapRef.current.getCamera();

    mapRef.current.animateCamera(
      {
        ...camera,
        center: { ...coords },
        zoom: 16,
      },
      1000,
    );
  };

  const onMapClick = async ({ nativeEvent }) => {
    const { coordinate } = nativeEvent;
    setMarker(coordinate);
    const { latitude, longitude } = coordinate;
    const address = await Address.getByCoords(latitude, longitude);
    console.log('address ===', address);

    if (modalPickMode === 2) {
      setEndpointVal(address.display);
    } else {
      setLocationData({ ...coordinate, ...address });
    }

    if (modalPickMode !== 0) {
      setModalVisible(true);
      setModalPick(0);
    }
  };
  const createDelayedOrder = async (modalData) => {
    console.log('createDelayedOrder');
    openAlert({
      title: `Замовити авто на дату \n ${modalData.date}?`,
      description: 'Ми попередимо Вас за деякий час виїзду водія',
      buttons: [
        {
          text: 'Так',
          onPress: async () => {
            const orderId = await order.makeOrder(
              locationData.NAMEST,
              locationData.NAMEHS,
              locationData.latitude,
              locationData.longitude,
              modalData.additionalInfo,
              modalData.tip,
              modalData.carLevel,
              modalData.paymentType,
              modalData.date,
              endpoint.val,
            );
            console.log('delayed order', orderId);
            await AsyncStorage.setItem('_delayedOrderId', `${orderId}`);
          },
        },
        { text: 'Ні', style: 'cancel' },
      ],
    });
  };
  const submitOrderHandler = async (modalData = {}) => {
    if (modalData.date) {
      createDelayedOrder(modalData);
      return;
    }
    console.log('paymentType : ', paymentType);
    order.setStatus('LOOKING FOR');
    order.setPaymentType(paymentType);

    const { NAMEST, NAMEHS, longitude, latitude } = locationData;
    const { additionalInfo, tip, carLevel } = modalData;
    const orderId = await order.makeOrder(
      NAMEST,
      NAMEHS,
      latitude,
      longitude,
      additionalInfo,
      tip,
      carLevel,
      paymentType,
      '',
      endpoint.val,
    );
    if (!orderId) return;
    console.log({ orderId });
    await Api.Database.sendStatus(orderId, 'LOOKING FOR');
    await Api.Database.read(orderId, onStatusUpdate);
    await AsyncStorage.setItem('_orderId', `${orderId}`);
    await AsyncStorage.setItem('_orderPayment', paymentType);
    if (!orderId) {
      Alert.alert('Помилка', 'Сталася помилка при відправці замовлення, спробуйте ще раз');
    }
    return orderId;
  };
  const onStatusUpdate = async (snapshot) => {
    const data = snapshot.val();
    order.setStatus(data.STATUS);
    switch (data.STATUS) {
      case 'FOUND':
        openAlert({
          title: 'Таксі знайдено!',
          description: `Авто (модель: ${data.MODEL_CAR}, колір: ${data.COLOR})\n з позивним номером ${data.SIMNUM} вже вирушило на адресу замовлення!`,
          buttons: [{ text: 'Гаразд' }],
        });
        const id = await AsyncStorage.getItem('_orderId');
        order.setOrderId(id);
        driver.setData(data.SIMNUM, data.MODEL_CAR, data.COLOR, data.CARDID);
        onCarFound();
        break;
      case 'ONPLACE':
        const { number, car, color } = driver;
        openAlert({
          title: 'Таксі прибуло',
          description: `Авто (модель: ${car}, колір: ${color})\n з позивним номером ${number} вже на місці призначення!`,
          buttons: [{ text: 'Гаразд' }],
        });
        break;
      case 'LOOKING FOR':
        break;
      case 'PAID':
        await Api.Order.stopGettingCoords();
        break;
      case 'DELAYED':
        openAlert({
          title: 'На жаль, не знайдено вільного авто.',
          description:
            'Наразі немає вільного таксі, але ви можете залишити замовлення та оператор зателефонує коли авто буде знайдено!',
          buttons: [
            {
              text: 'Скасувати',
              style: 'cancel',
              onPress: () => {
                cancelTripHandler(true);
              },
            },
            {
              text: 'Залишити',
            },
          ],
        });
        break;
      case 'CANCELED':
        order.setStatus('null');
        cancelTripHandler(false);
        openAlert({
          title: 'На жаль, наразі немає вільного таксі.',
          buttons: [
            {
              text: 'Ок',
            },
          ],
        });
        break;
      case 'INVOICE':
        await Api.Order.stopGettingCoords();
        order.setPaymentData(data.CASHE_PAID, data.LIQPAY);
        openAlert({
          title: 'Поїздку завершено!',
          description: 'Перейдіть до оплати',
          buttons: [
            {
              text: 'Карткою',
              onPress: async () => {
                await paymentHandler(data, 'liquid');
                setRateModalVisible(false);
              },
            },
            {
              text: 'Готівкою',
              onPress: () => {
                cancelTripHandler(false);
                setRateModalVisible(true);
              },
            },
          ],
        });
        setAlertPrimary(true);
        console.log('handler', backHandler);

        if (backHandler) {
          backHandler.remove();
          BackHandler.addEventListener('hardwareBackPress', () => true);
        }
        break;
      default:
        break;
    }
  };
  const paymentHandler = async (payment, type = 'privat') => {
    if (type === 'privat') {
      const privatRes = await Api.LiqPay.privatPay(payment.CASHE_PAID, "Поїздка таксі 'Пілот'");
      Linking.openURL(privatRes.data.url_privatpay);
      const statusRes = await Api.LiqPay.getStatus(privatRes.data.order_id);
    } else {
      navigation.navigate('Оплата', { ...payment, type: 'payment' });
    }
  };
  const onCarFound = () => {
    setCarVisible(true);
    if (userLocation && userLocation.latitude) {
      const { latitude: startlat, longitude: startlon } = userLocation;
      const { latitude: endlat, longitude: endlon } = locationData;
      const initialDistance = getDistanceFromLatLonInKm(startlat, startlon, endlat, endlon) * 1000;
      console.log('initial distance', initialDistance);
      if (!initialDistance) return;
      if (initialDistance < 300) {
        watchUserLocation(initialDistance);
      }
    }

    Api.Order.startGettingCoords(profile.hash, order.orderId, setNextCarPosition);
  };

  const submitNewLocation = async (latitude, longitude) => {
    Order.setNewLocation(profile.hash, order.orderId, latitude, longitude);
  };

  const watchUserLocation = async (initialDistance) => {
    console.log('watch user location');
    const id = await Geolocation.watchPosition(
      (position) => {
        const { latitude: userLat, longitude: userLon } = position.coords;
        const { latitude: orderLat, longitude: orderLon } = locationData;
        const distance = getDistanceFromLatLonInKm(userLat, userLon, orderLat, orderLon) * 1000;
        const isClientComingToCar = distance < initialDistance;
        const isDistanceInLimit = distance >= 100 && distance <= 300;
        if (isClientComingToCar && isDistanceInLimit) {
          if (!isUpdatingLocation) {
            openAlert({
              title: 'Ви змінили місцезнаходження',
              description: 'Чи бажаєте передати водієві нові координати?',
              buttons: [
                {
                  text: 'Так',
                  onPress: () => {
                    setUpdatingLocation(true);
                    submitNewLocation(userLat, userLon);
                  },
                },
                {
                  text: 'Ні',
                  onPress: () => {
                    Geolocation.clearWatch(locationWatchId);
                  },
                },
              ],
            });
          } else {
            submitNewLocation(userLat, userLon);
          }
        }
        // console.log(distance);
        // console.log('new position', position);
      },
      (err) => console.error(err),
      { maximumAge: 0, enableHighAccuracy: true, distanceFilter: 100 },
    );
    setLocationWatchId(id);
  };

  const setOrderInfo = (prev, next, isFull) => {
    const distance = getDistanceFromLatLonInKm(
      prev.latitude,
      prev.longitude,
      next.latitude,
      next.longitude,
    );
    order.setTime((distance * 1.5) / 30, isFull);
    order.setDistance(distance * 1.5, isFull);
  };

  const cancelTripHandler = async (isManual = true, status = -1) => {
    if (isManual) await Order.cancel(order.orderId, profile.hash, status, Platform.OS);
    await Api.Order.stopGettingCoords();
    await AsyncStorage.setItem('_orderId', '');
    Database.stopReading(order.orderId);
    setNextCarPosition(null);
    setCarVisible(false);
    order.clearOrder();
    Geolocation.clearWatch(locationWatchId);
  };

  const closeModal = () => setModalVisible(false);
  const openModal = () => setModalVisible(true);

  const deliveryBtnHandler = () => {
    setModalType(modalType == 'taxi' ? 'delivery' : 'taxi');
    setModalVisible(true);
  };
  const searchInputFocus = (taxi = false) => {
    if (taxi === true) {
      setModalType('taxi');
    } else {
      setModalType(choice === 'taxi' ? 'taxi' : 'delivery');
    }
    setModalVisible(true);
  };

  const [choice, setChoice] = useState('taxi');
  const switchChoice = () => setChoice(choice === 'taxi' ? 'delivery' : 'taxi');

  const centerCar = async () => {
    const camera = await mapRef.current.getCamera();
    mapRef.current.animateCamera(
      {
        ...camera,
        center: { ...nextCarPosition },
      },
      1000,
    );
  };

  const onMapLayout = async () => {
    await animateToRegion();
  };

  useEffect(() => {
    setAnimation(true);
    setTimeout(() => {
      setAnimation(false);
    }, 1200);
  }, []);

  useEffect(() => {
    if (!nextCarPosition) {
      return;
    }
    setOrderInfo(nextCarPosition, { latitude: order.userLatitude, longitude: order.userLongitude });
  }, [nextCarPosition]);

  useFocusEffect(
    useCallback(() => {
      if (!route || !route.params || !route.params.nativeEvent) {
        return;
      }

      onMapClick(route.params);
    }, [route]),
  );
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const defaultPaymentType = await AsyncStorage.getItem('_paymentType');
        if (defaultPaymentType) {
          setPaymentType(defaultPaymentType);
        }
        console.log({ defaultPaymentType });
      })();
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      const back = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      setBackHandler(back);
      return back.remove;
    }, [isModalVisible]),
  );
  const onBackPress = () => {
    if (isModalVisible) closeModal();
    else {
      openAlert({
        title: 'Вийти з додатку?',
        description: 'Ви дійсно бажаєте вийти з додатку?',
        buttons: [
          {
            text: 'Так',
            onPress: () => BackHandler.exitApp(),
          },
          {
            text: 'Ні',
            style: 'cancel',
          },
        ],
      });
    }
    return true;
  };

  const removeBackHandler = () => {
    BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  };

  //used to get data from firebase when re-enter to app
  const setExistOrderData = (data) => {
    Object.values(data).forEach((item, i) => {
      if (item.STATUS === 'FOUND') {
        console.log(i, item);
        driver.setData(item.SIMNUM, item.MODEL_CAR, item.COLOR, item.CARDID);
      }
    });
  };

  useEffect(() => {
    (async () => {
      setPaymentType(profile.defaultPaymentType);
      const orderId = await AsyncStorage.getItem('_orderId');
      const orderPayment = await AsyncStorage.getItem('_orderPayment');
      if (orderPayment) {
        order.setPaymentType(orderPayment);
      }
      if (orderId) {
        Database.read(orderId, onStatusUpdate);
        const data = await Database.getOrderData(orderId);
        if (data) {
          setExistOrderData(data);
        }
      }
    })();
    return () => Order.stopGettingCoords();
  }, []);

  useEffect(() => {
    setInputValue(locationData.display);
  }, [locationData]);

  useEffect(() => {
    console.log(isAlertPrimary, !!backHandler);
    if (!isAlertVisible) {
      setAlertPrimary(false);
    }
    if (backHandler && isAlertPrimary) {
      backHandler.remove();
      const back = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      setBackHandler(back);
    }
  }, [isAlertVisible]);

  console.log({ status: order.status });

  return (
    <View>
      <View style={s.container}>
        <View style={s.mapWrapper}>
          <Map
            style={s.homeMapStyle}
            onPress={onMapClick}
            iconsVisible={!isModalVisible}
            isCenterIconVisible={location.isFromUser}
            {...{ marker }}
            {...{ nextCarPosition }}
            {...{ selectPlace }}
            ref={mapRef}
            {...{ centerMapByUser }}
            {...{ onMapLayout }}
            {...{ order }}
            {...{ isCarVisible }}
            isLastToUser={nextCarPosition == userLocation}
            showsUserLocation
          />
        </View>

        {!isModalVisible && (
          <View style={{ ...s.searchContainer, backgroundColor: theme.background + 'D9' }}>
            {(order.status === 'null' || order.status === 'INVOICE') && (
              <OrderNull
                onInputFocus={searchInputFocus}
                isWrongAddress={locationData.isWrong}
                {...{ setPaymentType }}
                submitHandler={submitOrderHandler}
                deliveryBtnHandler={deliveryBtnHandler}
                {...{ selectPlace }}
                {...{
                  switchPaymentType,
                  paymentType,
                  modalType,
                  isModalVisible,
                  openModal,
                  inputValue,
                }}
              />
            )}
            {order.status === 'ONPLACE' && <OrderWaiting />}
            {(order.status === 'LOOKING FOR' || order.status === 'DELAYED') && (
              <OrderSearch cancelTripHandler={cancelTripHandler} />
            )}
            {order.status === 'TAXOMETR' && <OrderWithClient />}
            {order.status === 'FOUND' && (
              <OrderComing
                navigation={navigation}
                isCarCoords={!!nextCarPosition}
                order={order}
                cancelTripHandler={cancelTripHandler}
                {...{ centerCar }}
              />
            )}
            {order.status === 'confirmed' && <OrderConfirmed />}
          </View>
        )}
      </View>
      {!isModalVisible && (
        <HamburgerButton
          callback={() => setDrawerOpened(true)}
          openDrawer={navigation.openDrawer}
        />
      )}
      {!isModalVisible && (
        <View
          style={{
            ...s.placesContainer,
          }}
        >
          <TouchableOpacity style={s.place} activeOpacity={0.7} onPress={() => selectPlace('home')}>
            {/* <View style={s.place}> */}
            <View
              style={{
                ...s.homePlaceContainer,
                borderColor: theme.secondary,
                backgroundColor: theme.background,
              }}
            >
              <View style={{ borderRightColor: theme.text, borderRightWidth: 2 }}>
                <Text
                  style={{
                    ...s.placeText,
                    color: theme.text,
                  }}
                >
                  Дім
                </Text>
              </View>
            </View>
            {/* </View> */}
          </TouchableOpacity>
          <TouchableOpacity style={s.place} activeOpacity={0.7} onPress={() => selectPlace('work')}>
            {/* <View style={s.place}> */}
            <View
              style={{
                ...s.workPlaceContainer,
                borderColor: theme.secondary,
                backgroundColor: theme.background,
              }}
            >
              <Text
                style={{
                  ...s.placeText,
                  color: theme.text,
                }}
              >
                Робота
              </Text>
            </View>
            {/* </View> */}
          </TouchableOpacity>
        </View>
      )}
      <BookAutoModal
        isVisible={isModalVisible}
        {...{ closeModal, modalType, setModalType, setModalPick, endpoint, setEndpoint }}
        {...{ setEndpointVal, navigation, route, locationData }}
        {...{ setLocationData }}
        {...{ paymentType, setPaymentType }}
        makeOrder={submitOrderHandler}
        location={inputValue}
        setLocation={setInputValue}
      />
      <RateModal
        {...{ cancelTripHandler }}
        isVisible={isRateModalVisible}
        closeModal={() => setRateModalVisible(false)}
      />

      {isAnimation && <CircleAnimation />}
      <Alert />
    </View>
  );
};
Home.navigationOptions = () => ({
  swipeEnabled: false,
  edgeWidth: 0,
});

export default observer(Home);
