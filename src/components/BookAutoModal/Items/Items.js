import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
  Keyboard,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import s from './Items.s';
import { useStore } from '../../../stores/createStore';
import { filterDistricts } from '../../../api/locations';
import AndroidAutocomplete from '../../AndroidAutocomplete/AndroidAutocomplete';
import RoundButton from '../../RoundButton/RoundButton';
import rajonlist from '../../../../assets/rajonlist.json';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import 'moment/locale/uk';
import DatePicker from 'react-native-datepicker';

const carLevelTexts = ['економ', 'звичайний', 'преміум'];

export default ({
  setLocation,
  addNewItem,
  location,
  pickOnMapHandler,
  modalType,
  endpoint,
  setEndpointVal,
  addCar,
  removeCar,
  onCarsViewPress,
  carsInputRef,
  numberCars,
  setNumberCars,
  makeChoice,
  option,
  customMoneyRef,
  chosenMoney,
  setCustomMoney,
  carOption,
  toggleOption,
  removeHour,
  hour,
  addHour,
  min,
  makeOrder,
  removeMin,
  addMin,
  orderItems,
  updateItem,
  deleteItem,
  closeModal,
  time,
  locationData,
  setLocationData,
  navigation,
  setOrderItemImage,
  carLevel,
  setCarLevel,
  openCropModal,
  paymentType,
  setPaymentType,
  onSubmit,
  setDate,
  isLoading,
  date,
}) => {
  const { theme } = useStore((store) => store.viewer);
  const scrollRef = useRef();

  const onImagePress = (image, index) => {
    openCropModal(image, index, true);
  };
  const [isPickingDate, setPickingDate] = useState(false);
  const [deliveryScrollHeight, setDeliveryScrollHeight] = useState(0);

  const openDatePicker = (mode) => {
    setPickingDate(true);
    setDate({ ...date, mode });
  };
  const onDateChange = (event, selectedDate) => {
    console.log('event', event, selectedDate);
    if (event.type === 'dismissed') {
      setDate({ value: new Date(), isPicked: false, mode: 'date' });
      setPickingDate(false);
      return;
    }
    if (
      selectedDate &&
      date.mode === 'time' &&
      selectedDate < +moment().add(20, 'minutes').valueOf()
    ) {
      Alert.alert(
        'Невірний час',
        `Мінімальний час для замовлення на потім - ${moment()
          .locale('uk')
          .add(20, 'minutes')
          .fromNow()}`,
      );
      return;
    }
    if (date.mode === 'date') {
      setDate({
        ...date,
        value: selectedDate ? new Date(selectedDate) : new Date(),
        isPicked: true,
        mode: 'time',
      });
    } else {
      setPickingDate(false);
      setDate({
        ...date,
        value: selectedDate ? new Date(selectedDate) : new Date(),
        isPicked: true,
      });
    }
  };

  //autocomplete
  const [disInputPos, setDisInputPos] = useState({});
  const [isDisAutocomplete, setDisAutocomplete] = useState(false);
  const [districts, setDistricts] = useState(rajonlist);

  const setAutocompletePos = ({ nativeEvent }) => setDisInputPos({ top: nativeEvent.pageY + 50 });

  const onDistrictPress = (district) => {
    Keyboard.dismiss();
    setEndpointVal(district.name);
    setDistricts([]);
  };
  const onDistrictChangeText = (text) => {
    setEndpointVal(text);
    const filteredDistricts = filterDistricts(text);
    setDistricts(filteredDistricts);
  };
  const addZero = (word) => (`${word}`.length == 1 ? '0' + word : word);
  let d = date.value;
  const hours = addZero(d.getHours());
  const minutes = addZero(d.getMinutes());
  const days = addZero(d.getDate());
  const months = addZero(d.getMonth() + 1);
  const years = `${d.getFullYear()}`;

  const iconSize = hp(4) > 25 ? 25 : hp(4);
  const iconContainerStyle = { ...s.iconContainer, borderColor: theme.secondary };
  const lineStyle = { ...s.line, backgroundColor: theme.secondary + '40' };

  const deliveryScrollToEnd = (width, height) => {
    if (modalType === 'delivery') {
      if (deliveryScrollHeight < height) {
        scrollRef.current.scrollToEnd();
      }
      setDeliveryScrollHeight(height);
    }
  };

  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        ref={scrollRef}
        onContentSizeChange={deliveryScrollToEnd}
        keyboardShouldPersistTaps="always"
      >
        <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
          {modalType === 'taxi' ? (
            <View style={s.lineContainer}>
              <View style={iconContainerStyle}>
                <FontAwesome5Icon name="location-arrow" size={iconSize} color={theme.text} />
              </View>
              <View style={lineStyle} />
              <View style={iconContainerStyle}>
                <FontAwesome5Icon name="credit-card" size={iconSize} color={theme.text} />
              </View>
              <View style={lineStyle} />
              <View style={iconContainerStyle}>
                <FontAwesome5Icon name="map-marked-alt" size={iconSize} color={theme.text} />
              </View>
              <View style={lineStyle} />
              <View style={iconContainerStyle}>
                <FontAwesome5Icon name="level-up-alt" size={iconSize} color={theme.text} />
              </View>
              <View style={lineStyle} />
              <View style={iconContainerStyle}>
                <FontAwesome5Icon name="donate" size={iconSize} color={theme.text} />
              </View>
              <View style={lineStyle} />
              <View style={iconContainerStyle}>
                <FontAwesome5Icon name="credit-card" size={iconSize} color={theme.text} />
              </View>
              <View style={lineStyle} />
              <View style={iconContainerStyle}>
                <FontAwesome5Icon name="calendar-alt" size={iconSize} color={theme.text} />
              </View>
            </View>
          ) : (
            <View style={{ ...s.lineContainer, marginTop: hp(8) }}>
              <View style={iconContainerStyle}>
                <FontAwesome5Icon name="location-arrow" size={iconSize} color={theme.text} />
              </View>
              <View style={{ ...lineStyle, height: hp(9) }} />
              <View style={iconContainerStyle}>
                <FontAwesome5Icon name="credit-card" size={iconSize} color={theme.text} />
              </View>
              {orderItems.map(({ amount }, idx) => (
                <View key={idx}>
                  <View style={{ ...lineStyle, height: hp(5), alignSelf: 'center' }} />
                  <View style={iconContainerStyle}>
                    <TextInput
                      value={amount}
                      style={{ ...s.amountInput, color: theme.text }}
                      maxLength={2}
                      keyboardType="numeric"
                      placeholderTextColor={theme.text + '80'}
                      onChangeText={(value) => updateItem(idx, null, value)}
                    />
                    {/* <FontAwesome5Icon name="credit-card" size={iconSize} color={theme.text} /> */}
                  </View>
                </View>
              ))}
            </View>
          )}
          <View
            style={{
              ...s.row,
            }}
          >
            <View style={s.itemContainer}>
              <Text style={{ ...s.label, color: theme.text }}>Звідки їдемо</Text>
              <TouchableOpacity
                onPress={() => pickOnMapHandler(1)}
                style={{ ...s.input, borderBottomColor: theme.text + '80' }}
              >
                <Text style={{ textAlign: 'center', color: theme.text }}>
                  {locationData.display}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {modalType === 'taxi' && (
            <View style={{ ...s.row }}>
              <View
                style={s.itemContainer}
                onLayout={({ nativeEvent }) =>
                  setDisInputPos({
                    top: nativeEvent.layout.y + nativeEvent.layout.height,
                  })
                }
              >
                <Text style={{ ...s.label, color: theme.text }}>Куди їдемо</Text>
                <TextInput
                  onFocus={() => setDisAutocomplete(true)}
                  onBlur={() => setDisAutocomplete(false)}
                  value={endpoint.val}
                  style={{ ...s.input, color: theme.text, borderBottomColor: theme.anotherMain }}
                  placeholder="Куди їдемо?"
                  onTouchStart={setAutocompletePos}
                  placeholderTextColor={endpoint.val ? '#ccc' : '#aaa'}
                  onChangeText={onDistrictChangeText}
                />
                {/* <Icon
                  name="map"
                  color={theme.text}
                  onPress={() => pickOnMapHandler(2)}
                  size={20}
                  style={s.mapIconSecondary}
                /> */}
              </View>
            </View>
          )}

          <View style={s.row}>
            <View style={s.itemContainer}>
              <Text style={{ ...s.label, color: theme.text }}>Оплата</Text>
              <View style={s.switchContainer}>
                <TouchableOpacity
                  onPress={() => setPaymentType('cash')}
                  style={{
                    ...s.switchItem,
                    borderBottomColor: paymentType === 'cash' ? theme.secondary : theme.background,
                  }}
                >
                  <Text
                    style={{
                      ...s.optionText,
                      color: theme.text,
                    }}
                  >
                    Готівка
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  underlayColor={carLevel === 1 ? '#111' : '#DDD'}
                  onPress={() => setPaymentType('card')}
                  style={{
                    ...s.switchItem,
                    borderBottomColor: paymentType === 'card' ? theme.secondary : theme.background,
                  }}
                >
                  <Text
                    style={{
                      ...s.optionText,
                      color: theme.text,
                    }}
                  >
                    Карта
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {modalType === 'taxi' ? (
            <View style={{ flex: 1 }}>
              <View style={s.row}>
                <View style={s.itemContainer}>
                  <Text style={{ ...s.label, color: theme.text }}>
                    Рівень авто, {carLevelTexts[+carLevel - 1]} - {carLevel}
                  </Text>
                  <View style={s.switchContainer}>
                    <TouchableOpacity
                      onPress={() => setCarLevel(1)}
                      style={{
                        ...s.switchItem,
                        borderBottomColor: carLevel === 1 ? theme.secondary : theme.background,
                      }}
                    >
                      <Text
                        style={{
                          ...s.optionText,
                          color: theme.text,
                        }}
                      >
                        I
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setCarLevel(2)}
                      style={{
                        ...s.switchItem,
                        borderBottomColor: carLevel === 2 ? theme.secondary : theme.background,
                      }}
                    >
                      <Text
                        style={{
                          ...s.optionText,
                          color: theme.text,
                        }}
                      >
                        II
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setCarLevel(3)}
                      style={{
                        ...s.switchItem,
                        borderBottomColor: carLevel === 3 ? theme.secondary : theme.background,
                      }}
                    >
                      <Text
                        style={{
                          ...s.optionText,
                          color: theme.text,
                        }}
                      >
                        III
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={s.row}>
                <View style={s.itemContainer}>
                  <Text style={{ ...s.label, color: theme.text }}>Додаткова оплата</Text>
                  <View style={s.switchContainer}>
                    <TouchableOpacity
                      onPress={() => makeChoice(1)}
                      style={{
                        ...s.switchItem,
                        borderBottomColor: option === 1 ? theme.secondary : theme.background,
                      }}
                    >
                      <Text
                        style={{
                          ...s.moreMoneyItemText,
                          color: theme.text,
                        }}
                      >
                        +10₴
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => makeChoice(2)}
                      style={{
                        ...s.switchItem,
                        borderBottomColor: option === 2 ? theme.secondary : theme.background,
                      }}
                    >
                      <Text
                        style={{
                          ...s.moreMoneyItemText,
                          color: theme.text,
                        }}
                      >
                        +20₴
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => makeChoice(3)}
                      style={{
                        ...s.switchItem,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        borderBottomColor: option === 3 ? theme.secondary : theme.background,
                      }}
                    >
                      <TextInput
                        onTouchStart={() => makeChoice(3)}
                        ref={customMoneyRef}
                        defaultValue="+"
                        style={{
                          color: theme.text,
                        }}
                        keyboardType="numeric"
                        value={chosenMoney.custom}
                        onChangeText={setCustomMoney}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={s.row} activeOpacity={1}>
                <View style={s.itemContainer}>
                  <Text style={{ ...s.label, color: theme.text }}>Додаткові опції</Text>

                  <View style={s.switchContainer}>
                    <TouchableOpacity
                      onPress={() => toggleOption('air')}
                      style={{
                        ...s.switchItem,
                        borderBottomColor: carOption.air ? theme.secondary : theme.background,
                      }}
                    >
                      <IconMCI color={theme.text} name="air-conditioner" size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => toggleOption('bag')}
                      style={{
                        ...s.switchItem,
                        borderBottomColor: carOption.bag ? theme.secondary : theme.background,
                      }}
                    >
                      <Icon color={theme.text} name="dolly" size={30} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => toggleOption('zoo')}
                      style={{
                        ...s.switchItem,
                        borderBottomColor: carOption.zoo ? theme.secondary : theme.background,
                      }}
                    >
                      <Icon color={theme.text} name="dog" size={30} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={s.group}>
                <View style={s.itemContainer}>
                  <View style={s.timePickContainer}>
                    <Text style={{ ...s.label, color: theme.text }}>Час</Text>
                    <TouchableOpacity
                      onPress={() => setDate({ value: new Date(), isPicked: false, mode: 'date' })}
                    >
                      <Text style={{ ...s.clearTimeText, color: theme.text }}>Очистити</Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={{ ...s.timeNum, color: theme.text }}
                    onPress={() => openDatePicker('date')}
                  >
                    {date.isPicked
                      ? ` ${days}.${months}.${years}  ${hours}:${minutes}`
                      : 'Обрати час'}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {orderItems.map(({ text, amount, key, image }, idx) => (
                <View
                  key={key}
                  style={{
                    ...s.deliveryItemsView,
                    position: 'relative',
                    // marginTop: idx === 0 ? hp(4.5) : 0,
                    // backgroundColor: theme.rare,
                  }}
                >
                  <TextInput
                    onChangeText={(value) => updateItem(idx, value, null)}
                    value={text}
                    placeholder="Назва товару"
                    placeholderTextColor={theme.text + '80'}
                    style={{ ...s.productInput, color: theme.text }}
                  />
                  {image ? (
                    <TouchableWithoutFeedback
                      onPress={() => onImagePress(imgUri, idx)}
                      style={{ ...s.itemIcon, justifyContent: 'center', height: 50 }}
                    >
                      <Image style={{ height: 30, width: 30 }} source={{ uri: image.uri }} />
                    </TouchableWithoutFeedback>
                  ) : (
                    <Icon
                      style={s.itemIcon}
                      name="image"
                      size={28}
                      color={theme.text}
                      onPress={() => setOrderItemImage(idx)}
                    />
                  )}
                  <Icon
                    style={s.itemIcon}
                    name="times"
                    size={28}
                    color={theme.text}
                    onPress={() => deleteItem(idx)}
                  />
                </View>
              ))}
              <Icon style={s.addNewIcon} size={40} name="plus-circle" onPress={addNewItem} />
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
      <View style={s.footer}>
        <View style={s.btns}>
          <View style={s.btnsHor}>
            <TouchableOpacity
              style={{ ...s.btn, backgroundColor: theme.anotherMain }}
              onPress={() => navigation.navigate('Мої місця', { isPicking: true })}
            >
              <Text style={{ ...s.btnText, color: theme.text }}>Мої місця</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...s.btn, backgroundColor: theme.anotherMain }}
              onPress={() => navigation.navigate('Історія', { isPicking: true })}
            >
              <Text style={{ ...s.btnText, color: theme.text }}>Історія</Text>
            </TouchableOpacity>
          </View>
        </View>
        <RoundButton
          onPress={onSubmit}
          {...{ isLoading }}
          textStyle={{ color: theme.text }}
          style={{
            paddingVertical: 10,
            alignSelf: 'stretch',
            backgroundColor: locationData.isWrong ? theme.secondary + '96' : theme.secondary,
          }}
          disabled={locationData.isWrong || isLoading}
          text="Замовити"
        />
        {isPickingDate && (
          <DateTimePicker
            minimumDate={+moment().add(20, 'minutes').valueOf()}
            onChange={onDateChange}
            value={date.value}
            mode={date.mode}
          />
        )}
      </View>
      {isDisAutocomplete && (
        <AndroidAutocomplete
          data={districts}
          top={disInputPos.top}
          onPress={onDistrictPress}
          elementKey="name"
        />
      )}
    </>
  );
};
