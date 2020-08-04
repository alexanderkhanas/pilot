import { types as t } from 'mobx-state-tree';
import { asyncModel } from './utils';
import Api from '../api';

export const AuthStore = t.model('AuthStore', {
  login: asyncModel(loginFlow),
  finalLogin: asyncModel(finalLoginFlow),
  finalRegister: asyncModel(finalRegisterFlow),
});

function loginFlow(phoneNumber) {
  return async (self, parent, root) => {
    const loginResponse = await Api.Auth.login(phoneNumber);
    const { data } = loginResponse;
    console.log('login', data);
    root.viewer.profile.setPhoneNumber(phoneNumber);
    root.viewer.profile.setBackendData(+data.VCODE, +data.USERID);
    if (data.BLACKLIST === 2) return;
    if (data.USERID === -1) return false;

    const [surname, name] = data.NAMEP.split(' ');
    root.viewer.profile.setProfileData(name, surname, data.NICKNAME);

    return true;
  };
}

function finalLoginFlow(phoneNumber, vCode, fullName, nickname, deviceToken) {
  return async (self, parent, root) => {
    console.log('token in state', deviceToken);
    const { data } = await Api.Auth.finalLogin(
      fullName,
      nickname,
      phoneNumber,
      root.viewer.profile.userId,
      vCode,
      deviceToken,
    );
    console.log('data', data);
    if (!data.HASHKEY) return false;
    const avatarResponse = await Api.Viewer.getAvatar(data.HASHKEY);
    console.log('avatarres', typeof avatarResponse.data);
    if (typeof avatarResponse.data === 'string') {
      root.viewer.profile.setProfileAvatar(`data:image/gif;base64,${avatarResponse.data}`);
    }
    await root.places.fetch(data.HASHKEY);
    root.viewer.profile.setHash(data.HASHKEY);
    return true;
  };
}

function finalRegisterFlow(fullName, nickname, phoneNumber, vCode, userId, deviceToken) {
  return async (self, parent, root) => {
    console.log('token in state', deviceToken);
    const response = await Api.Auth.finalRegister(
      fullName,
      nickname,
      phoneNumber,
      vCode,
      userId,
      deviceToken,
    );
    console.log(response.data);
    if (!response.data.HASHKEY) return false;
    root.viewer.profile.setHash(response.data.HASHKEY);
    return true;
  };
}
