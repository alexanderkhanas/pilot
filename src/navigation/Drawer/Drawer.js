import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  ImageBackground,
  Text,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
  Linking,
} from 'react-native';
import s from './Drawer.s';
import back from '../../../assets/drawerBackground.png';
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useStore } from '../../stores/createStore';
import { observer } from 'mobx-react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useIsDrawerOpen } from '@react-navigation/drawer';
import RoundButton from '../../components/RoundButton/RoundButton';
import { AlertContext } from '../../context/AlertState';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

const imageObject = {
  Історія: 'car',
  'Мої місця': 'location-arrow',
  'Мої бонуси': 'gift',
  'Мій профіль': 'address-card',
  'Мої картки': 'credit-card',
  Оплата: 'wallet',
  Головна: 'home',
};

const invisibleRoutes = ['Про водія', 'Мій профіль', 'Оплата', 'Права'];

const Drawer = ({ state, navigation }) => {
  const routes = state.routeNames.filter((name) => !invisibleRoutes.includes(name));
  const { profile, order, theme } = useStore((store) => store.viewer);
  const { openAlert } = useContext(AlertContext);
  const redirectToWebsite = () => {
    Linking.openURL('https://fastandclever.com/');
  };
  return (
    <View
      source={back}
      style={{
        // width: wp(100),
        height: hp(100),
        flexDirection: 'row',
        backgroundColor: '#00000000',
      }}
    >
      <View source={back} style={{ ...s.drawerContainer, backgroundColor: theme.background }}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Мій профіль')}>
          <View style={{ ...s.userInfoContainer, borderBottomColor: theme.anotherMain }}>
            {profile.avatarUri ? (
              <Image style={s.userIcon} source={{ uri: profile.avatarUri }} />
            ) : (
              <View style={{ ...s.defaultUserAvatarContainer, backgroundColor: theme.secondary }}>
                <FontAwesome5Icon
                  name="user"
                  style={s.defaultUserAvatar}
                  color={theme.background}
                  solid
                  size={wp(10)}
                />
              </View>
            )}

            <View style={s.userInfo}>
              <Text
                style={{
                  ...s.userName,
                  fontSize: wp(4),
                  color: theme.text,
                }}
              >
                {profile.fullName}
              </Text>
              <Text
                style={{ ...s.userPhone, color: theme.text }}
              >{`+38${profile.phoneNumber}`}</Text>
              <FontAwesome5Icon
                onPress={() => navigation.navigate('Мій профіль')}
                style={s.settingsIcon}
                name="cog"
                size={20}
                color={theme.text}
              />
            </View>
            {/* <Icon name="user-edit" style={s.editIcon} size={20} color={theme.text} /> */}
          </View>
        </TouchableWithoutFeedback>
        <View style={s.items}>
          {routes.map(
            (el, i) =>
              !invisibleRoutes.includes(el) && (
                <TouchableOpacity
                  style={s.drawerItem}
                  key={i}
                  onPress={() => navigation.navigate(el)}
                >
                  <View style={s.row}>
                    <Icon
                      name={imageObject[el]}
                      size={25}
                      color={theme.text + '99'}
                      style={{ marginRight: 30 }}
                    />
                    <Text style={{ ...s.drawerItemTitle, color: theme.text }}>{el}</Text>
                  </View>
                </TouchableOpacity>
              ),
          )}
          {order.status === 'INVOICE' && (
            <TouchableOpacity style={s.drawerItem} onPress={() => navigation.navigate('Оплата')}>
              <View style={s.row}>
                <Icon
                  name={imageObject['Оплата']}
                  size={25}
                  color={theme.text + '99'}
                  style={{ marginRight: 30 }}
                />
                <Text style={{ ...s.drawerItemTitle, color: theme.text }}>Оплата</Text>
              </View>
            </TouchableOpacity>
          )}

          <View style={{ ...s.footer, borderTopColor: theme.anotherMain }}>
            <View style={s.orderCar}>
              {/* <Text style={{ ...s.orderCarText, color: theme.text }}>Дзвінок оператору</Text> */}
              <Text style={{ ...s.orderCarNum, color: theme.secondary }}>52-10</Text>
              <FontAwesome5Icon
                style={s.phoneIcon}
                onPress={() => Linking.openURL(`tel:52-10`)}
                color={theme.secondary}
                name="phone"
                size={50}
              />
              {/* <TouchableOpacity onPress={() => Linking.openURL(`tel:52-10`)}>
                <Image style={s.orderCarImage} source={require('../../../assets/phoneIcon.png')} />
              </TouchableOpacity> */}
            </View>
            <View>
              <Text style={{ ...s.footerText, color: theme.text + '99' }}>Версія 1.00</Text>
              <TouchableOpacity onPress={redirectToWebsite}>
                <Text style={{ ...s.footerText, color: theme.text + '99' }}>
                  Розроблено F&C group
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Права')}>
                <Text style={{ ...s.footerText, color: theme.text + '99', marginTop: 10 }}>
                  Всі права захищені
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <View style={{ ...s.buttonContainer, borderTopColor: theme.anotherMain }}>
          <RoundButton onPress={askLogout} disabled={false} text="Вийти" />
        </View> */}
      </View>
      {!!useIsDrawerOpen() && (
        <View style={s.overlay}>
          <TouchableOpacity
            style={{ width: wp(29), height: hp(100) }}
            onPress={() => navigation.closeDrawer()}
          ></TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default observer(Drawer);
