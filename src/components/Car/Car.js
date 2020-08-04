import React, { useRef, useState, useEffect } from 'react';
import MapView, { AnimatedRegion } from 'react-native-maps';
import { Animated } from 'react-native';
import { toRadians, getDistanceFromLatLonInKm, toDegrees } from '../../utils';

export default ({ nextCarPosition }) => {
  const carRef = useRef(null);
  const [carPositionNumber, setCarPositionNumber] = useState(null);
  const [animateCarValue, setAnimateCarValue] = useState(null);
  //variables
  const [carRotation] = useState(new Animated.Value(0));
  const [carRotationNumber, setCarRotationNumber] = useState(0);
  const rotation = carRotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });
  // effect
  useEffect(() => {
    if (!nextCarPosition) {
      return;
    }
    if (!carPositionNumber) {
      setAnimateCarValue(
        new AnimatedRegion({ ...nextCarPosition, latitudeDelta: 0.025, longitudeDelta: 0.025 }),
      );
      setCarPositionNumber(nextCarPosition);
      return;
    }
    const rotation = getRotation(
      carPositionNumber.latitude,
      carPositionNumber.longitude,
      nextCarPosition.latitude,
      nextCarPosition.longitude,
      carRotationNumber,
    );
    const rotateDuration = 500;
    setCarRotationNumber(rotation);
    const distance = getDistanceFromLatLonInKm(
      carPositionNumber.latitude,
      carPositionNumber.longitude,
      nextCarPosition.latitude,
      nextCarPosition.longitude,
    );
    const moveDuration = 4500;
    rotateAnimation(
      carRotation,
      rotation,
      rotateDuration,
      animateCarValue,
      nextCarPosition,
      moveDuration,
    );
  }, [nextCarPosition]);
  function rotateAnimation(prevAngle, nextAngle, rotateDuration, prevPos, nextPos, moveDuration) {
    Animated.timing(prevAngle, {
      toValue: nextAngle,
      duration: rotateDuration,
      useNativeDriver: false,
    }).start(() => {
      moveAnimation(prevPos, nextPos, moveDuration);
    });
  }
  function moveAnimation(prevPos, nextPos, moveDuration) {
    setCarPositionNumber(nextPos);
    prevPos
      .timing({
        ...nextPos,
        duration: moveDuration,
      })
      .start();
  }
  return (
    !!animateCarValue && (
      <MapView.Marker.Animated
        coordinate={animateCarValue}
        ref={carRef}
        flat={true}
        style={{ transform: [{ rotate: rotation }] }}
      >
        <Animated.Image
          style={{
            width: 45,
            height: 20,
            resizeMode: 'stretch',
          }}
          source={require('../../../assets/car-png-top.png')}
        />
      </MapView.Marker.Animated>
    )
  );
};

function getRotation(startLat, startLng, destLat, destLng, currentRotation) {
  startLat = toRadians(startLat);
  startLng = toRadians(startLng);
  destLat = toRadians(destLat);
  destLng = toRadians(destLng);

  let y = Math.sin(destLng - startLng) * Math.cos(destLat);
  let x =
    Math.cos(startLat) * Math.sin(destLat) -
    Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  let brng = Math.atan2(y, x);
  brng = toDegrees(brng);
  let final = ((brng + 360) % 360) - 90;
  if (final < 0) {
    final = 360 - Math.abs(final);
  }
  if (final - currentRotation > 180) {
    final = final - 360;
    return final;
  }
  if (currentRotation - final > 180) {
    final = 360 + final;
    return final;
  }
  return final;
}
