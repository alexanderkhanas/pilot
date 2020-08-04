import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import s from './MyTrips.s';
import {
  ScrollView,
  Animated,
  BackHandler,
  AsyncStorage,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header/Header';
import GestureWrapper from '../../components/GestureWrapper/GestureWrapper';
import Trip from '../../components/Trip/Trip';
import DetailTripModal from '../../components/DetailTripModal/DetailTripModal';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useStore } from '../../stores/createStore';
import { observer } from 'mobx-react';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { AlertContext } from '../../context/AlertState';

const myTrips = ({ navigation, route }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const modalValue = useRef(new Animated.Value(0)).current;
  const [activeItem, setActiveItem] = useState();
  const [isLoading, setLoading] = useState(false);
  const { history, theme, profile } = useStore((store) => store.viewer);

  const closeButton = () => modalAnimation(false);
  const { openAlert, Alert } = useContext(AlertContext);
  const modalRight = modalValue.interpolate({ inputRange: [0, 1], outputRange: [hp(-100), 0] });
  const modalOpacity = modalValue;

  const modalAnimation = (isShow) => {
    Animated.timing(modalValue, {
      toValue: isShow ? 1 : 0,
      useNativeDriver: false,
    }).start(() => {
      modalAnimationCallback(isShow);
    });
  };

  const modalAnimationCallback = (isShow) => {
    if (isShow) return;
    setModalVisible(false);
  };

  const detailButtonPress = (i) => {
    setModalVisible(true);
    setActiveItem(history.items[i]);
  };

  const deleteTrip = (i) => {
    const copy = [...history.items];
    copy.splice(i, 1);
    history.setHistory(copy);
  };
  const backButtonHandler = () => {
    if (isModalVisible) return modalAnimation(false);
    else return navigation.goBack();
  };
  const fetchMore = async () => {
    await history.fetchMore(profile.hash);
  };
  useEffect(() => {
    modalAnimation(isModalVisible);
  }, [isModalVisible]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () =>
      navigation.setParams({ isPicking: false }),
    );
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      console.log('got new items?', await history.fetchMore(profile.hash));
      setLoading(false);
    })();
    console.log(route);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isModalVisible) modalAnimation(false);
        else navigation.navigate('Головна');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isModalVisible, modalAnimation]),
  );
  const itemPressHandler = (trip) => {
    openAlert({
      title: 'Замовлення таксі',
      description: `Замовити авто на початкову точку (${trip.fromFetched}) чи на кінцеву (${trip.toFound})?`,
      buttons: [
        {
          text: 'Початкова',
          onPress: () =>
            navigation.navigate('Головна', {
              nativeEvent: {
                coordinate: {
                  latitude: trip.latFrom,
                  longitude: trip.lonFrom,
                },
              },
            }),
        },
        {
          text: 'Кінцева',
          onPress: () =>
            navigation.navigate('Головна', {
              nativeEvent: {
                coordinate: {
                  latitude: trip.latTo,
                  longitude: trip.lonTo,
                },
              },
            }),
        },
        {
          text: 'Відмінити',
          style: 'cancel',
        },
      ],
    });
  };
  return (
    <GestureWrapper {...{ route }} onSwipeRight={navigation.openDrawer} onSwipeLeft={closeButton}>
      <Header
        title="Історія"
        iconRight={<FontAwesome5Icon name="map" size={26} color={theme.text} />}
        back={backButtonHandler}
      />
      <Animated.View
        style={{
          position: 'absolute',
          top: hp(12),
          left: modalRight,
          opacity: modalOpacity,
          width: wp(100),
          flex: 1,
          backgroundColor: '#fab300',
          zIndex: 1,
          height: hp(100),
        }}
      ></Animated.View>
      <ScrollView contentContainerStyle={s.itemsContainer}>
        {history.items.length !== 0 ? (
          <>
            {history.items.map((el, i) => {
              // console.log('item', el);
              return (
                <Trip
                  key={i}
                  trip={el}
                  {...{ theme }}
                  index={i}
                  detailButtonPress={() => detailButtonPress(i)}
                  deleteTrip={() => deleteTrip(i)}
                  isPicking={route?.params?.isPicking}
                  onPress={itemPressHandler}
                  onPick={() =>
                    navigation.navigate('Головна', { to: el.endPoint, from: el.startPoint })
                  }
                />
              );
            })}
            {history.items.length % 7 === 0 && (
              <TouchableOpacity style={s.moreButton} onPress={fetchMore}>
                <Text style={{ ...s.moreButtonText, color: theme.text }}>Отримати більше</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={s.emptyMsgContainer}>
            {isLoading ? (
              <ActivityIndicator
                style={{ transform: [{ scale: 2 }] }}
                size="large"
                color={theme.text}
              />
            ) : (
              <Text style={{ ...s.emptyMsgText, color: theme.text }}>
                Ваш список поїздок порожній.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
      <Alert />
    </GestureWrapper>
  );
};

export default observer(myTrips);
