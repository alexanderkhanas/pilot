import React, { useEffect, useState, useRef } from 'react';
import s from './BookAutoModal.s';
import {
  View,
  Image,
  Animated,
  Text,
  TouchableOpacity,
  Keyboard,
  Button,
  Alert,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Items from './Items/Items';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useStore } from '../../stores/createStore';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-picker';
import CropImageModal from '../CropImageModal/CropImageModal';
import Api from '../../api';

const carOptionTranslate = {
  air: 'кондиціонер',
  zoo: 'з твариною',
  bag: 'з багажом',
};

const tipValues = {
  1: '10',
  2: '20',
};

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

export default ({
  setLocation,
  isVisible,
  closeModal,
  location,
  modalType,
  setModalType,
  setModalPick,
  endpoint,
  setEndpoint,
  locationData,
  setLocationData,
  setEndpointVal,
  route,
  makeOrder,
  navigation,
  paymentType,
  setPaymentType,
}) => {
  //animation
  const [bottom] = useState(new Animated.Value(hp(-30)));
  const [isModalHidden, setModalHidden] = useState(true);

  const pickOnMapHandler = (mode) => {
    setModalPick(mode);
    closeModal();
  };
  const showAnimation = () => {
    Animated.timing(bottom, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const hideAnimation = () => {
    Animated.timing(bottom, {
      toValue: hp(-100),
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setModalHidden(true);
    });
  };

  //hooks

  useEffect(() => {
    if (isVisible) {
      setModalHidden(false);
      showAnimation();
    } else hideAnimation();
  }, [isVisible]);

  // input shit
  const [date, setDate] = useState({ value: new Date(), isPicked: false, mode: 'date' });

  const [numberCars, setNumberCars] = useState('1');
  const carsInputRef = useRef();
  const onCarsViewPress = () => {
    setNumberCars('');
    carsInputRef.current.focus();
  };
  const addCar = () => {
    if (+numberCars >= 9) return;
    setNumberCars((+numberCars + 1 || 0).toString(10));
  };
  const removeCar = () => {
    if (+numberCars <= 1) return;
    setNumberCars((+numberCars - 1 || 2).toString(10));
  };

  const [chosenMoney, setChosenMoney] = useState({ option: 0, custom: 'своє' });
  const setCustomMoney = (custom) => setChosenMoney({ ...chosenMoney, custom });
  const customMoneyRef = useRef();
  const makeChoice = (option) => {
    let custom = chosenMoney.custom;
    if (option === 3 && chosenMoney.option !== 3) {
      if (custom.includes('с')) custom = '+';
      customMoneyRef.current.focus();
    } else Keyboard.dismiss();

    if (chosenMoney.option === option) setChosenMoney({ custom, option: 0 });
    else setChosenMoney({ custom, option });
  };

  const [carOption, setCarOptions] = useState({ air: false, bag: false, zoo: false });
  const toggleOption = (key) => setCarOptions({ ...carOption, [key]: !carOption[key] });

  const { option } = chosenMoney;
  const [carLevel, setCarLevel] = useState(2);
  const [time, setTime] = useState(0);
  const setTimeWrap = (value) => value <= 6 * 60 && value >= 0 && setTime(value);

  const addMin = () => setTimeWrap(time === 0 ? 30 : time + 10);
  const removeMin = () => setTimeWrap(time === 30 ? 0 : time - 10);
  const addHour = () => setTimeWrap(time + 60);
  const removeHour = () => setTimeWrap(time - 60);

  const hour = Math.floor(time / 60);
  const min = time - hour * 60;

  // delivery
  const [orderItems, setOrderItems] = useState([
    { key: Math.random(), text: '', amount: '1', image: null },
  ]);
  const addNewItem = () => {
    setOrderItems([...orderItems, { key: Math.random(), text: '', amount: '1', image: null }]);
  };
  // DELIVERY ITEM IMAGE
  const [cropPhoto, setCropPhoto] = useState({});
  const [isCropping, setCropping] = useState(false);
  const [itemIndex, setItemIndex] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const openCropModal = (image, index, isImageEditing = false) => {
    if (image.error) return Alert.alert('error', 'photo error');
    if (image.uri) {
      console.log('image', image);
      setItemIndex(index);
      setEditing(isImageEditing);
      setCropPhoto(image);
      setCropping(true);
    }
  };
  const deleteImage = () => {
    Alert.alert('Видалити фото', 'Ви дійсно хочете видалити фото товару?', [
      { text: 'Ні', style: 'cancel' },
      {
        text: 'Так',
        onPress: () => {
          const copy = [...orderItems];
          copy[itemIndex].imgUri = '';
          setOrderItems(copy);
          setCropping(false);
        },
      },
    ]);
  };
  const onImageSave = (image) => {
    setCropping(false);
    const copy = [...orderItems];
    copy[itemIndex].image = {
      name: cropPhoto.fileName,
      type: cropPhoto.type,
      uri: Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
    };
    setOrderItems(copy);
  };

  const setOrderItemImage = (idx) => {
    ImagePicker.showImagePicker(options, (image) => {
      openCropModal(image, idx);
    });
  };
  const updateItem = (idx, text, amount) => {
    const copy = [...orderItems];
    const newItem = { ...orderItems[idx] };
    if (typeof text === 'string') newItem.text = text;
    if (amount === '0' || amount === '00' || isNaN(amount)) newItem.amount = '1';
    else newItem.amount = amount;
    copy.splice(idx, 1, newItem);
    setOrderItems(copy);
  };
  const deleteItem = (idx) => {
    const copy = [...orderItems];
    copy.splice(idx, 1);
    setOrderItems(copy);
  };

  //set props

  const setTaxiProps = () => {
    let string = '';
    Object.keys(carOption).forEach((key, i) =>
      carOption[key] ? (string += carOptionTranslate[key] + ',') : '',
    );
    if (time) string += `через ${hour} год. ${min} хв.,`;
    return string;
  };
  const setDeliveryProps = () => {
    let string = 'ДОСТАВКА \n';
    orderItems.forEach((el, i) => (string += `Товар: ${el.text}, Кількість: ${el.amount},\n`));
    return string;
  };

  const closeModalHandler = () => {
    closeModal();
  };

  const onDeliverySubmit = async (orderId) => {
    const form = new FormData();
    const itemsCopy = [...orderItems];
    itemsCopy.filter((item, i) => item.image || item.text);
    itemsCopy.forEach((item, i) => {
      if (!item.image && !item.text) return;
      const key = `${orderId}_${i}_${item.amount}`;
      if (item.image) {
        const format = item.image.type === 'image/jpeg' ? 'jpg' : 'png';
        form.append(key, {
          name: 'img.' + format,
          type: item.image.type,
          uri: Platform.OS === 'android' ? item.image.uri : image.uri.replace('file://', ''),
        });
      }
      if (item.text) {
        form.append(key, item.text);
      }

      console.log({ item });
    });
    // const format = orderItems[0].image.type === 'image/jpeg' ? 'jpg' : 'png';
    // form.append('123123123_1', {
    //   name: 'abc.' + format,
    //   type: orderItems[0].image.type,
    //   uri:
    //     Platform.OS === 'android'
    //       ? orderItems[0].image.uri
    //       : orderItems[0].image.uri.replace('file://', ''),
    // });
    // form.append('123123123_1_1', orderItems[0].text);
    console.log('form', form);
    return Api.Order.newDelivery(form);
  };

  const onSubmit = async () => {
    setLoading(true);
    const filteredItems = [...orderItems].filter((item) => item.image || item.text);
    console.log('filtered', filteredItems);
    if (modalType === 'delivery' && !filteredItems.length) return;
    let { option, custom } = chosenMoney;
    const d = date.value;
    let dateString = '';
    const addZero = (word) => (`${word}`.length === 1 ? '0' + word : word);
    if (d && d > new Date()) {
      dateString = `${addZero(d.getDay())}.${addZero(d.getMonth())}.${addZero(
        d.getFullYear(),
      )} ${addZero(d.getHours())}:${addZero(d.getSeconds())}`;
    }
    console.log({ dateString });
    if (modalType === 'delivery') {
      await onDeliverySubmit(orderResponse);
    }
    const orderResponse = await makeOrder({
      paymentType,
      tip: option != 3 ? tipValues[option] : custom.slice(1, custom.length),
      carLevel,
      additionalInfo: setTaxiProps(),
      date: dateString,
    });
    setLoading(false);
    setDate({ value: new Date(), isPicked: false, mode: 'date' });
    closeModal();

    console.log('orderResponse', orderResponse);
  };

  const { theme } = useStore((store) => store.viewer);
  if (isModalHidden) return <View />;

  //styles

  let taxiStyle, deliveryStyle, taxiTextStyle, deliveryTextStyle;
  const textStyle = { ...s.switchButtonText, color: theme.text };
  const activeButtonStyle = { ...s.switchButton, backgroundColor: theme.main };
  if (modalType === 'taxi') {
    taxiStyle = activeButtonStyle;
    deliveryStyle = s.switchButton;
    taxiTextStyle = textStyle;
    deliveryTextStyle = textStyle;
  } else {
    taxiStyle = s.switchButton;
    deliveryStyle = activeButtonStyle;
    taxiTextStyle = textStyle;
    deliveryTextStyle = textStyle;
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Animated.View style={{ ...s.container, bottom, backgroundColor: theme.background }}>
        <View style={{ ...s.topContainer, marginTop: Platform.OS === 'ios' ? 30 : 0 }}>
          <TouchableOpacity style={taxiStyle} onPress={() => setModalType('taxi')}>
            <Text style={taxiTextStyle}>Таксі</Text>
          </TouchableOpacity>
          <TouchableOpacity style={deliveryStyle} onPress={() => setModalType('delivery')}>
            <Text style={deliveryTextStyle}>Доставка</Text>
          </TouchableOpacity>
          <FontAwesome5Icon
            style={s.button}
            name="times-circle"
            color={theme.text}
            size={s.closeImage.width}
            onPress={closeModalHandler}
          />
          {/* <TouchableOpacity >
          <Image style={s.closeImage} source={require('../../../assets/closeBtn.png')} />
        </TouchableOpacity> */}
        </View>
        {/* <View style={{ flexDirection: 'row', flex: 1 }}> */}
        <Items
          {...{ setLocation, location, pickOnMapHandler, modalType, endpoint, setEndpoint }}
          {...{ setEndpointVal, addCar, removeCar, onCarsViewPress, carsInputRef }}
          {...{ makeOrder, locationData, setLocationData, chosenMoney, hour, addHour, min }}
          closeModal={closeModalHandler}
          {...{
            numberCars,
            setNumberCars,
            makeChoice,
            option,
            customMoneyRef,
          }}
          {...{
            setCustomMoney,
            carOption,
            toggleOption,
            removeHour,
          }}
          {...{
            removeMin,
            time,
            addMin,
            orderItems,
            updateItem,
            deleteItem,
            addNewItem,
            navigation,
          }}
          {...{
            setOrderItemImage,
            openCropModal,
            carLevel,
          }}
          {...{ setPaymentType, paymentType, setCarLevel }}
          {...{ onSubmit, onDeliverySubmit }}
          {...{ date, setDate, isLoading }}
        />
        {/* </View> */}
        <CropImageModal
          visible={isCropping}
          cropPhoto={{ uri: cropPhoto.uri }}
          onSave={onImageSave}
          otherButtons={isEditing ? [{ icon: 'trash', onPress: () => deleteImage() }] : []}
          closeModal={() => setCropping(false)}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
