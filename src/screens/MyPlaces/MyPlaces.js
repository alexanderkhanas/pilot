import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import s from './MyPlaces.s';
import GestureWrapper from '../../components/GestureWrapper/GestureWrapper';
import Header from '../../components/Header/Header';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Picker,
  Animated,
  Modal,
  AsyncStorage,
  BackHandler,
} from 'react-native';
import MyPlaceItem from '../../components/MyPlaceItem/MyPlaceItem';
import { whp, useKeyboard } from '../../utils';
import Api from '../../api';
import { useStore } from '../../stores/createStore';
import { useFocusEffect } from '@react-navigation/native';
import FullPlaceModal from '../../components/AddPlaceModal/FullPlaceModal';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { observer } from 'mobx-react';
import { AlertContext } from '../../context/AlertState';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const MyPlaces = ({ navigation, route }) => {
  const [keyboard, setKeyboard] = useState({ open: false, height: 0 });
  const { viewer, places } = useStore((store) => store);
  const { profile, theme } = viewer;
  const { Alert, openAlert } = useContext(AlertContext);
  const [allPlaces, setAllPlaces] = useState(places.all || []);
  const [filteredPlaces, setFilteredPlaces] = useState(places.all || []);
  const [editItem, setEditItem] = useState(null);

  const keyboardDidShow = ({ endCoordinates: pos }) => {
    setKeyboard({ open: true, height: pos.height });
  };
  const keyboardDidHide = () => {
    setKeyboard({ open: false, height: keyboard.height });
  };
  useKeyboard(keyboardDidShow, keyboardDidHide);

  const [isLoading, setLoading] = useState(false);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [maxPlaceId, setMaxPlaceId] = useState(0);

  const filterPlace = ({ ADDON_INFO, settlement }) => {
    let valueToSearch = ADDON_INFO;
    if (!valueToSearch) valueToSearch = settlement;
    return valueToSearch.toLocaleLowerCase().includes(search.toLocaleLowerCase());
  };
  const itemPressHandler = (name, address) => {
    openAlert({
      title: 'Замовлення таксі',
      description: 'Додати це місце в замовлення? \n' + name,
      buttons: [
        { text: 'Підтвердити', onPress: () => navigation.navigate('Головна', address) },
        // { text: 'Їду сюди', onPress: () => navigation.navigate('Головна', { to: address }) },
        { text: 'Відмінити', style: 'cancel' },
      ],
    });
  };

  const editItemStart = async (item) => {
    setEditItem(item);
    setAddModalVisible(true);
  };

  const deleteItem = async (item) => {
    const { ADDON_INFO: name, NAMEST: street, NAMEHS: house, UID: id } = item;
    const copy = [...allPlaces];
    console.log('id', id);
    openAlert({
      title: 'Видалити місце',
      description: `Видалити адресу ${street} ${house} з списку моїх місць?`,
      buttons: [
        {
          text: 'Так',
          onPress: async () => {
            setAllPlaces(copy.filter((place) => place.UID !== id));
            await Api.Place.delete(profile.hash, id);
          },
        },
        { text: 'Ні', style: 'cancel' },
      ],
    });
    if (name.toLowerCase() === 'робота') {
      places.setWork(null);
      const item = allPlaces.filter((place) => {
        console.log(
          'place',
          place,
          place.ADDON_INFO.toLowerCase() === 'робота' && place.UID !== id,
        );
        return place.ADDON_INFO.toLowerCase() === 'робота' && place.UID !== id;
      })[0];
      places.setWork(item || null);
    } else if (name.toLowerCase() === 'дім') {
      const item = allPlaces.filter(
        (place) => place.ADDON_INFO.toLowerCase() === 'дім' && place.UID !== id,
      )[0];
      places.setHome(item || null);
    }
    // await places.get();
  };

  const closeModal = () => {
    setAddModalVisible(false);
    places.setPickingType(null);
  };

  useEffect(() => {
    const items = search ? allPlaces.filter(filterPlace) : allPlaces;
    setFilteredPlaces(items);
  }, [search, allPlaces]);

  useFocusEffect(
    useCallback(() => {
      console.log('type', places.pickingType);
      if (places.pickingType) {
        setAddModalVisible(true);
      }
    }, []),
  );

  useEffect(() => {
    setAllPlaces(places.all || []);
  }, [places.all]);

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

  return (
    <GestureWrapper {...{ route }} onSwipeRight={navigation.openDrawer} {...{ navigation }}>
      <Header
        title="Мої місця"
        iconRight={<FontAwesome5Icon name="map-signs" size={26} color={theme.text} />}
        back={() => navigation.navigate('Головна')}
      />
      {allPlaces.length || search ? (
        <View style={s.container}>
          <TextInput
            onChangeText={setSearch}
            style={{ ...s.input, color: theme.text }}
            placeholderTextColor={theme.text + '80'}
            placeholder="Пошук по імені"
          />
          <View style={s.scrollContainer}>
            <ScrollView>
              {filteredPlaces.map((item, i) => {
                console.log('item ===', item);

                return (
                  <MyPlaceItem
                    {...{ navigation }}
                    {...{ item }}
                    key={i}
                    {...{ openAlert }}
                    {...{ theme }}
                    editItem={editItemStart}
                    {...{ deleteItem }}
                    onPress={itemPressHandler}
                  />
                );
              })}
            </ScrollView>
          </View>
        </View>
      ) : (
        <View style={s.emptyMsgContainer}>
          {isLoading ? (
            <Text />
          ) : (
            <Text style={{ ...s.emptyMsgText, color: theme.text }}>
              Ваш список улюблених місць порожній.
            </Text>
          )}
        </View>
      )}
      <Animated.View
        style={{
          ...s.bottomContainer,
          backgroundColor: theme.main,
        }}
      >
        <View style={s.bottomButtonWrapper}>
          <TouchableOpacity
            style={{ ...s.bottomButton, backgroundColor: theme.secondary }}
            onPress={() => setAddModalVisible(true)}
          >
            <Text style={{ ...s.bottomButtonText, color: theme.text }}>Додати місце</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <FullPlaceModal
        isVisible={isAddModalVisible}
        {...{ setAllPlaces }}
        {...{ allPlaces }}
        {...{ theme }}
        {...{ maxPlaceId }}
        {...{ editItem }}
        {...{ setEditItem }}
        getTrips={places.fetch}
        {...{ closeModal }}
      />
      <Alert />
    </GestureWrapper>
  );
};

export default observer(MyPlaces);
