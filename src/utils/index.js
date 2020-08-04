import { Dimensions, Keyboard } from 'react-native';
import { useEffect } from 'react';
import { findClosestStreet } from '../api/locations';

export const classnames = (...args) => {
  return args.reduce((acc, cur) => {
    if (!cur) return;
    if (Array.isArray(cur)) {
      for (let i = 0; i < cur.length; i += 2) {
        if (cur[i + 1]) acc = { ...acc, ...cur[i] };
      }
    } else if (typeof cur === 'object') {
      acc = { ...acc, ...cur };
    }
    return acc;
  }, {});
};

export const whp = (p) => Dimensions.get('window').height * (p / 100);
export const wwp = (p) => Dimensions.get('window').width * (p / 100);

export const useKeyboard = (onDidShow, onDidHide, deps) => {
  useEffect(() => {
    const didShow = Keyboard.addListener('keyboardDidShow', onDidShow);
    const didHide = Keyboard.addListener('keyboardDidHide', onDidHide);
    return () => {
      didShow.remove();
      didHide.remove();
    };
  }, deps || []);
  return Keyboard;
};

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = toRadians(lat2 - lat1); // deg2rad below
  var dLon = toRadians(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}
// Converts from degrees to radians.
export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

// Converts from radians to degrees.
export function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

export const capitalize = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

export function convertHistoryItem(apiObject) {
  return {
    orderId: apiObject.ORDERID,
    date: apiObject.DATEN,
    latFrom: apiObject.LAT_FROM,
    lonFrom: apiObject.LON_FROM,
    latTo: apiObject.LAT_TO,
    lonTo: apiObject.LON_TO,
    price: apiObject.PRICEALL,
    distance: apiObject.DISTANCE,
    time: apiObject.TRAVELTIME,
    fromFetched: `вул ${capitalize(apiObject.NAMEST)} ${apiObject.NAMEHS}`,
    toFound: findClosestStreet(apiObject.LAT_TO, apiObject.LON_TO).display,
    driverNum: apiObject.SIMNUM,
  };
}
