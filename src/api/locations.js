import streets from '../../assets/streetlist.json';
import houses from '../../assets/houselist.json';
import districts from '../../assets/rajonlist.json';
import settlements from '../../assets/settlementList.json';
import { getDistanceFromLatLonInKm } from '../utils'; // nice func name clown

export const findClosestStreet = (lat, long) => {
  const { IDST, IDHS, NAMEHS, LATITUDE, LONGITUDE } = houses.reduce((prev, cur) => {
    const prevD = getDistanceFromLatLonInKm(lat, long, prev.LATITUDE, prev.LONGITUDE);
    const curD = getDistanceFromLatLonInKm(lat, long, cur.LATITUDE, cur.LONGITUDE);
    return prevD < curD ? prev : cur;
  });
  const { NAMEST } = streets.find((street) => street.IDST === IDST);
  return {
    IDST,
    IDHS,
    NAMEST,
    NAMEHS,
    display: `вул ${NAMEST} ${NAMEHS}`,
    latitude: LATITUDE,
    longitude: LONGITUDE,
  };
};

export const formatStreet = () => {
  const array = [];
  streets.forEach((el) => {
    const houseArray = houses.filter((house) => house.IDST == el.IDST);
    if (!houseArray.length || el.IDNP !== 1) return;
    array.push({ name: el.NAMEST.toLowerCase(), IDST: el.IDST });
  });
  return array;
};

// export const formattedHouses = houses.filter((house) => house.IDNP == 1);
// export const formattedStreets = streets.filter((street) => {
//   console.log(street.IDNP);
//   return street.IDNP === 1 && formattedHouses.filter((house) => house.IDST === street.IDST).length;
// });

// export const streetNames = Array.from(new Set(namesArray));
// console.log(streetNames);

export const getStreets = (text, IDNP) => {
  const filteredStreets = streets.filter(
    (street) => street.NAMEST.toLowerCase().startsWith(text.toLowerCase()) && street.IDNP == IDNP,
  );
  return filteredStreets;
};

export const getHousesOnStreet = (IDST, IDNP, text = '') =>
  houses.filter((house) => house.IDST == IDST && house.IDNP == IDNP);

export const getStreetsOnSettle = (IDNP) => {
  console.log({ IDNP });
  return streets.filter((street) => {
    return street.IDNP == IDNP;
  });
};

export const findStreet = (text, IDNP) =>
  streets.find((str) => text.toLowerCase() == str.NAMEST.toLowerCase() && str.IDNP == IDNP);

export const findSettlement = (text) => {
  console.log('text', text);
  return settlements.find((settle) => text.toLowerCase() == settle.NAMENP.toLowerCase());
};

export const findHouse = (text, street) => {
  const house = houses.find(
    (house) =>
      text.toLowerCase() == house.NAMEHS.toLowerCase() &&
      house.IDST == street.IDST &&
      house.IDNP == street.IDNP,
  );
  return house;
};

export const filterHouses = (text, street) => {
  return houses.filter(
    (house) =>
      house.NAMEHS.toLowerCase().startsWith(text.toLowerCase()) &&
      house.IDST == street.IDST &&
      house.IDNP == street.IDNP,
  );
};

export const filterDistricts = (text) =>
  districts.filter((dist) => dist.name.toLowerCase().startsWith(text.toLowerCase()));

export const filterSettlements = (text) =>
  settlements.filter((settle) => settle.NAMENP.toLowerCase().startsWith(text.toLowerCase()));
