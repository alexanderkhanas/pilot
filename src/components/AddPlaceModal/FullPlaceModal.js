import React, { useState, useEffect, useRef } from 'react';
import s from './AddPlaceModal.s';
import { View, Animated, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import RoundButton from '../RoundButton/RoundButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  getStreets,
  getHousesOnStreet,
  formattedStreets,
  filterHouses,
  findStreet,
  findSettlement,
  getStreetsOnSettle,
  filterSettlements,
  findHouse,
} from '../../api/locations';
import settlementsJSON from '../../../assets/settlementList.json';
import { useStore } from '../../stores/createStore';
import AndroidAutocomplete from '../AndroidAutocomplete/AndroidAutocomplete';
import { useKeyboard } from '../../utils';
import Api from '../../api';
import UnderlineInput from '../UnderlineInput/UnderlineInput';

export default ({
  isVisible,
  getTrips,
  closeModal,
  theme,
  editItem,
  setAllPlaces,
  allPlaces,
  setEditItem,
}) => {
  const { viewer, places } = useStore((store) => store);
  const { profile } = viewer;

  const namesObject = { home: 'Дім', work: 'Робота' };
  const [name, setName] = useState(namesObject[places.pickingType] || '');
  const [addonInfo, setAddonInfo] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [animValue] = useState(new Animated.Value(hp(100)));
  const [settlements, setSettlements] = useState(settlementsJSON);
  const [houses, setHouses] = useState([]);
  const [streets, setStreets] = useState([]);

  const [inputPos, setInputPos] = useState({});

  const [selectedSettlement, setSelectedSettlement] = useState({
    NAMENP: '',
    IDNP: 0,
  });
  const [selectedStreet, setSelectedStreet] = useState({
    NAMEST: '',
    IDST: 0,
  });
  const [selectedHouse, setSelectedHouse] = useState({
    NAMEHS: '',
    IDHS: 0,
  });
  const [selectedFlat, setSelectedFlat] = useState({ NAMEKV: '' });

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [autocompleteType, setAutocompleteType] = useState(null);

  //refs
  const inputRef = useRef();
  //actions

  useKeyboard(
    () => setKeyboardVisible(true),
    () => setKeyboardVisible(false),
  );

  const getRequestBody = () => {
    let requestBody = {
      IDST: 0,
      NAMEST: '',
      IDNP: selectedSettlement.IDNP,
      SHNAME: selectedSettlement.NAMENP,
      IDHS: 0,
      NAMEHS: '',
      LATITUDE: selectedSettlement.LATITUDE,
      LONGITUDE: selectedSettlement.LONGITUDE,
      ADDON_INFO: addonInfo,
      NAMEKV: selectedFlat.NAMEKV,
      FAVNAME: name,
    };
    if (selectedStreet.LATITUDE) {
      requestBody = {
        ...requestBody,
        ...selectedStreet,
      };
    }
    if (selectedHouse.LATITUDE) {
      requestBody = {
        ...requestBody,
        ...selectedHouse,
      };
    }
    return requestBody;
  };

  const addPlace = async () => {
    const body = getRequestBody();
    setLoading(true);
    const {
      IDST,
      IDNP,
      IDHS,
      NAMEHS,
      NAMEST,
      LONGITUDE: LON,
      LATITUDE: LAT,
      SHNAME,
      ADDON_INFO,
      NAMEKV,
      FAVNAME,
    } = body;
    const postResponse = await Api.Place.post(
      profile.hash,
      editItem ? editItem.UID : places.maxId + 1,
      IDST,
      IDHS,
      IDNP,
      NAMEST,
      NAMEHS,
      LAT,
      LON,
      SHNAME,
      ADDON_INFO,
      NAMEKV,
      FAVNAME,
    );
    console.log(postResponse.data);
    if (postResponse.data.Blacklist) {
      const placeToAdd = {
        ...body,
        LAT: +LAT,
        LON: +LON,
        UID: places.maxId + 1,
        IDST: +IDST,
        IDNP: +IDNP,
        IDHS: +IDHS,
        NAMEENTR: '',
        NAMEKV: '',
      };
      console.log('place to add ===', placeToAdd);

      addPlaceToState(placeToAdd);
      resetInputs();
    }
    // await places.fetch(profile.hash);
    setLoading(false);
    Keyboard.dismiss();
    closeModal();
  };

  const addPlaceToState = (placeToAdd) => {
    if (placeToAdd.FAVNAME.trim().toLocaleLowerCase() === 'дім') {
      places.setHome(placeToAdd);
    } else if (placeToAdd.FAVNAME.trim().toLocaleLowerCase() === 'робота') {
      places.setWork(placeToAdd);
    }
    places.increaseMaxId();
    let copy = [...allPlaces];
    if (editItem) {
      copy = copy.filter((item) => item.UID !== editItem.UID);
      setEditItem(null);
    }
    copy = [...copy, placeToAdd].sort((item1, item2) => item2.UID - item1.UID);
    setAllPlaces(copy);
  };

  const resetInputs = () => {
    setSelectedSettlement({
      NAMENP: '',
      IDNP: 0,
    });
    setSelectedStreet({
      NAMEST: '',
      IDST: 0,
    });
    setSelectedHouse({
      NAMEHS: '',
      IDHS: 0,
    });
    setSelectedFlat({ NAMEKV: '' });
    setName('');
  };

  const closeModalHandler = () => {
    if (editItem) {
      setEditItem(null);
    }
    closeModal();
  };

  const onNameInputChange = (text) => setName(text);
  const onInfoInputChange = (text) => setAddonInfo(text);

  //settlement
  const onSettlementChangeText = (text) => {
    let foundSettle = text.length > 3 ? findSettlement(text) : null;
    setSelectedHouse({});
    setSelectedStreet({});
    if (foundSettle) {
      setSelectedSettlement(foundSettle);
      setStreets(getStreetsOnSettle(foundSettle.IDNP));
    } else {
      setSelectedSettlement({ NAMENP: text, IDNP: '' });
    }
    const filtered = filterSettlements(text);
    setSettlements(filtered);
  };

  const onSettlementPress = (settle) => {
    setSettlements([]);
    setSelectedSettlement(settle);
    const str = getStreetsOnSettle(settle.IDNP);
    setStreets(str);
  };
  //street
  const onStreetPress = (street, name) => {
    setStreets([]);
    setSelectedStreet({ ...street, NAMEST: name });
    const housesOnStreet = getHousesOnStreet(street.IDST, selectedSettlement.IDNP);
    setHouses(housesOnStreet);
  };
  const onStreetChangeText = (text) => {
    let foundStreet;
    setSelectedHouse({});
    if (text.length > 3) {
      foundStreet = findStreet(text, selectedSettlement.IDNP);
    }
    if (foundStreet) {
      setSelectedStreet(foundStreet);
      const housesOnStreet = getHousesOnStreet(foundStreet.IDST);
      setHouses(housesOnStreet);
    } else {
      setSelectedStreet({ NAMEST: text, IDST: '' });
    }
    const filtered = getStreets(text, selectedSettlement.IDNP);
    setStreets(filtered);
  };

  //house
  const onHousePress = (item) => {
    setSelectedHouse(item);
    setHouses([]);
  };

  const onHouseChangeText = (text) => {
    let foundHouse = {};
    if (text.length) foundHouse = findHouse(text, selectedStreet);
    if (foundHouse) setSelectedHouse(foundHouse);
    else setSelectedHouse({ NAMEHS: text });
    const filteredHouses = filterHouses(text, selectedStreet);
    setHouses(filteredHouses);
  };

  const onFlatChangeText = (text) => setSelectedFlat({ NAMEKV: text });
  //effects
  useEffect(() => {
    animation(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (editItem) {
      const { ADDON_INFO, IDHS, IDNP, IDST, LAT, LON, NAMEHS, NAMEST, SHNAME, NAMEKV } = editItem;
      setSelectedSettlement({ NAMENP: SHNAME, IDNP, LATITUDE: LAT, LONGITUDE: LON });
      setSelectedStreet({ NAMEST, IDST });
      setSelectedHouse({ IDHS, NAMEHS });
      setSelectedFlat({ NAMEKV });
      setName(ADDON_INFO);
    }
  }, [editItem]);

  useEffect(() => {
    if (!isKeyboardVisible) setAutocompleteType('');
  }, [isKeyboardVisible]);

  useEffect(() => {
    if (places.pickingType) {
      setName(namesObject[places.pickingType]);
    }
  }, [places.pickingType]);

  //animation
  const animation = () => {
    Animated.timing(animValue, {
      toValue: isVisible ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  const opacity = animValue.interpolate({
    inputRange: [0, 0.5, 0.9, 1],
    outputRange: [0, 0.1, 0.4, 1],
  });
  const top = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [hp(100), 0],
  });

  const isDisabled = !selectedSettlement.IDNP;

  const autocompleteData =
    autocompleteType == 'house' ? houses : autocompleteType == 'street' ? streets : settlements;
  const onAutocompletePress =
    autocompleteType == 'house'
      ? onHousePress
      : autocompleteType == 'street'
      ? onStreetPress
      : onSettlementPress;
  const autocompleteItemKey =
    autocompleteType == 'house' ? 'NAMEHS' : autocompleteType == 'street' ? 'NAMEST' : 'NAMENP';

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Animated.View
        style={{
          ...s.container,
          top,
          opacity,
          justifyContent: isKeyboardVisible ? 'flex-start' : 'center',
          paddingVertical: 20,
        }}
      >
        {!!autocompleteType && (
          <AndroidAutocomplete
            data={autocompleteData}
            top={inputPos.top}
            onPress={onAutocompletePress}
            elementKey={autocompleteItemKey}
          />
        )}
        <View
          style={{ ...s.modal, backgroundColor: theme.main }}
          onLayout={({ nativeEvent }) =>
            setInputPos({ top: nativeEvent.layout.y + nativeEvent.layout.height / 1.7 })
          }
        >
          <Text style={{ ...s.title, color: theme.text }}>Додати в мої місця</Text>

          <FontAwesome5Icon
            name="times-circle"
            style={{ ...s.closeButton, color: theme.text }}
            onPress={closeModalHandler}
            size={25}
          />
          <UnderlineInput
            onTouchStart={({ nativeEvent }) => setInputPos({ top: nativeEvent.pageY + 20 })}
            onChangeText={onSettlementChangeText}
            value={selectedSettlement.NAMENP}
            labelColor={theme.text}
            label="Населений пункт"
            placeholder="Тернопіль"
            placeholderTextColor={theme.text + '80'}
            color={theme.text + '99'}
            onFocus={() => setAutocompleteType('settlement')}
            style={{
              ...s.input,
              color: theme.text,
              borderBottomColor: theme.text + '40',
            }}
            containerStyle={{ marginBottom: 15 }}
          />
          {/* <Text style={s.title}>
          Додати адресу {'\n'} {NAMEST} {NAMEHS}?
        </Text> */}
          <UnderlineInput
            label="Вулиця"
            onTouchStart={({ nativeEvent }) => setInputPos({ top: nativeEvent.pageY + 20 })}
            onChangeText={onStreetChangeText}
            labelColor={theme.text}
            reference={inputRef}
            value={selectedStreet.NAMEST}
            color={theme.text + '99'}
            placeholderTextColor={theme.text + '80'}
            onLayout={({ nativeEvent }) =>
              setInputPos({ top: nativeEvent.layout.y + nativeEvent.layout.height })
            }
            containerStyle={{ marginBottom: 15 }}
            placeholder="Руська"
            // onLayout={({ nativeEvent }) => {
            //   console.log('inputPos', inputPos.top);
            //   setInputPos({ top: inputPos.top + nativeEvent.layout.y + nativeEvent.layout.height });
            // }}
            onFocus={() => setAutocompleteType('street')}
            style={{
              ...s.input,
              color: theme.text,
              marginRight: 20,
              borderBottomColor: theme.text + '40',
            }}
          />

          <View style={s.row}>
            <UnderlineInput
              label="Будинок"
              onChangeText={onHouseChangeText}
              onTouchStart={({ nativeEvent }) => setInputPos({ top: nativeEvent.pageY + 20 })}
              value={selectedHouse.NAMEHS}
              labelColor={theme.text}
              color={theme.text + '99'}
              placeholderTextColor={theme.text + '80'}
              placeholder="1"
              onFocus={() => setAutocompleteType('house')}
              style={{
                color: theme.text,
                borderBottomColor: theme.text + '40',
              }}
            />
            <UnderlineInput
              label="Квартира"
              onChangeText={onFlatChangeText}
              labelColor={theme.text}
              value={selectedFlat.NAMEKV}
              color={theme.text + '99'}
              placeholderTextColor={theme.text + '80'}
              placeholder="20"
              style={{
                color: theme.text,
                borderBottomColor: theme.text + '40',
              }}
            />
          </View>
          <UnderlineInput
            label="Додаткова інформація"
            labelColor={theme.text}
            onChangeText={onInfoInputChange}
            value={addonInfo}
            color={theme.text + '99'}
            placeholderTextColor={theme.text + '80'}
            placeholder="Новий Рік 2018"
            style={{
              ...s.input,
              color: theme.text,
              borderBottomColor: theme.text + '40',
            }}
            containerStyle={{
              marginTop: 20,
            }}
          />
          <UnderlineInput
            label="Назва місця"
            labelColor={theme.text}
            onChangeText={onNameInputChange}
            value={name}
            color={theme.text + '99'}
            placeholderTextColor={theme.text + '80'}
            placeholder="Дім"
            style={{
              ...s.input,
              color: theme.text,
              borderBottomColor: theme.text + '40',
            }}
            containerStyle={{
              marginTop: 20,
            }}
          />
          <RoundButton
            onPress={addPlace}
            {...{ isLoading }}
            disabled={isDisabled}
            text={editItem ? 'Змінити' : 'Додати'}
            style={
              isDisabled || isLoading
                ? { ...s.button, ...s.btnDisabled, backgroundColor: theme.background + '80' }
                : { ...s.button, backgroundColor: theme.secondary }
            }
          />
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
