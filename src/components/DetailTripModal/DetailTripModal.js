import React, { useState, useRef, useEffect } from 'react';
import s from './DetailTripModal.s';
import { Text, View, Image, Animated, TouchableHighlight } from 'react-native';
import Trip from '../Trip/Trip';
import DriverInfo from '../DriverInfo/DriverInfo';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import placeIcon from '../../../assets/places.png';
import clock from '../../../assets/clock.png';
import Map from '../Map/Map';
import { useStore } from '../../stores/createStore';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const deltas = { latitudeDelta: 0.025, longitudeDelta: 0.025 };

export default ({ isVisible, driver, tripInfo, theme }) => {
  const [isMapScaled, setMapScaled] = useState(false);

  const [mapHeight] = useState(new Animated.Value(hp(35)));
  const [opacity] = useState(new Animated.Value(1));
  const mapRef = useRef(null);

  const mapScaleAnimation = () => {
    Animated.parallel([
      Animated.timing(mapHeight, {
        toValue: hp(73),
        duration: 300,
        useNativeDriver: false,
      }),

      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const mapUnScaleAnimation = () => {
    Animated.parallel([
      Animated.timing(mapHeight, {
        toValue: hp(35),
        duration: 300,
        useNativeDriver: false,
      }),

      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const mapAdjustSizeHandler = () => {
    !isMapScaled ? mapScaleAnimation() : mapUnScaleAnimation();
    setMapScaled(!isMapScaled);
  };

  const location = useStore((store) => store.viewer.location);
  const animateToRegion = async () => {
    mapRef.current.animateToRegion({ ...location }, 1000);
  };
  useEffect(() => {
    animateToRegion();
  }, []);

  if (!tripInfo) return null;

  return (
    <View style={{ zIndex: 100, opacity: 1 }}>
      <Animated.View style={{ ...s.modalContainer, backgroundColor: theme.main }}>
        <TouchableHighlight>
          <Animated.View style={{ height: mapHeight, width: wp(100) }}>
            <Map style={{ flex: 1 }} ref={mapRef} onPress={mapAdjustSizeHandler} />
          </Animated.View>
        </TouchableHighlight>
        <Animated.View>
          <View style={s.tripInfoTop}>
            <Trip isShort={true} trip={{ ...tripInfo }} {...{ theme }} />
          </View>
          <DriverInfo driver={{ name: 'Андрій', carNumber: 'ВО 0123 ВО' }} style={s.driver} />
        </Animated.View>
        <View style={{ ...s.tripInfo, backgroundColor: theme.main }}>
          <View style={s.infoItem}>
            <FontAwesome5Icon
              name="location-arrow"
              size={s.infoIcon.width}
              color={theme.text}
              style={s.infoIcon}
            />
            <Text style={{ color: theme.text }}>{tripInfo.distance} км.</Text>
          </View>
          <Animated.View style={{ ...s.infoItem, opacity: opacity }}>
            <FontAwesome5Icon
              name="clock"
              size={s.infoIcon.width}
              color={theme.text}
              style={s.infoIcon}
            />
            <Text style={{ color: theme.text }}>{tripInfo.time} хв.</Text>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};
