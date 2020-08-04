import { types as t, flow } from 'mobx-state-tree';
import { asyncModel } from './utils';
import Api from '../api';

const Place = t.model('PlaceModel', {
  ADDON_INFO: t.maybeNull(t.string),
  IDHS: t.maybeNull(t.number),
  IDNP: t.maybeNull(t.number),
  IDST: t.maybeNull(t.number),
  LAT: t.maybeNull(t.number),
  LON: t.maybeNull(t.number),
  NAMEENTR: t.maybeNull(t.string),
  NAMEHS: t.maybeNull(t.string),
  NAMEKV: t.maybeNull(t.string),
  NAMEST: t.maybeNull(t.string),
  SHNAME: t.maybeNull(t.string),
  UID: t.maybeNull(t.number),
});

export const PlacesStore = t
  .model('PlacesStore', {
    all: t.maybeNull(t.array(Place), []),
    maxId: t.maybeNull(t.number),
    home: t.maybeNull(t.string),
    work: t.maybeNull(t.string),
    pickingType: t.maybeNull(t.string),
  })
  .actions((self) => ({
    fetch: flow(function* getPlaces(hash) {
      console.log('get:hash', hash);
      const callback = (response) => {
        if (!Array.isArray(response.data)) return;
        const data = formatPlaces(response.data);
        return data;
        // self.maxId = max;
        // self.places = places;
      };
      const data = yield Api.Place.get(hash, callback);
      if (!data) return;
      const { places, maxId, homePlace, workPlace } = data;
      console.log('coming', places, maxId, homePlace, workPlace);
      self.all = places;
      self.maxId = maxId;
      self.home = JSON.stringify(homePlace);
      self.work = JSON.stringify(workPlace);
      console.log('maxID', maxId);
    }),
    setPickingType(type) {
      self.pickingType = type;
    },
    setAll(placesToSet) {
      const { places, maxId, homePlace, workPlace } = formatPlaces(placesToSet);
      console.log('set maxId', maxId);
      self.all = places;
      self.home = JSON.stringify(homePlace);
      self.work = JSON.stringify(workPlace);
      self.maxId = maxId;
    },
    setHome(home) {
      self.home = JSON.stringify(home);
    },
    setWork(work) {
      self.work = JSON.stringify(work);
    },
    increaseMaxId() {
      ++self.maxId;
    },
  }));

function formatPlaces(places) {
  let maxId = 0;
  let homePlace = null;
  let workPlace = null;
  const formatted = places.reverse().map((place) => {
    const name = place.FAVNAME?.trim()?.toLowerCase();
    if (name === 'дім') {
      homePlace = place;
    } else if (name === 'робота') {
      workPlace = place;
    }
    if (place.UID > maxId) {
      maxId = place.UID;
    }
    return {
      ...place,
      settlement: place.SHNAME,
    };
  });
  return { places: formatted, maxId, homePlace, workPlace };
}

// function loginFlow(phoneNumber) {
//   return async (self, parent, root) => {
//     const loginResponse = await Api.Auth.login(phoneNumber);
//     const { data } = loginResponse;
//     console.log('login', data);
//     root.viewer.profile.setPhoneNumber(phoneNumber);
//     root.viewer.profile.setBackendData(+data.VCODE, +data.USERID);
//     if (data.BLACKLIST === 2) return;
//     if (data.USERID === -1) return false;

//     const [surname, name] = data.NAMEP.split(' ');
//     root.viewer.profile.setProfileData(name, surname, data.NICKNAME);

//     return true;
//   };
// }
