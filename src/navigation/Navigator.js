import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home/Home';
import Profile from '../screens/Profile/Profile';
import MyTrips from '../screens/MyTrips/MyTrips';
import Login from '../screens/Login/Login';
import SMS from '../screens/SmsConfirmation/SmsConfirmation';
import AboutDriver from '../screens/AboutDriver/AboutDriver';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import CustomDrawer from './Drawer/Drawer';
import MyBonuses from '../screens/MyBonuses/MyBonuses';
import MyPlaces from '../screens/MyPlaces/MyPlaces';
import { useStore } from '../stores/createStore';
import { observer } from 'mobx-react';
import Register from '../screens/Register/Register';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MyCards from '../screens/MyCards/MyCards';
import Payment from '../screens/Payment/Payment';
import Rights from '../screens/Rights/Rights';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainNavigation = () => {
  const store = useStore();
  if (store.viewer.isLoggedIn === null) return null;
  return (
    <NavigationContainer>
      {store.viewer.isLoggedIn ? (
        <Drawer.Navigator
          initialRouteName="Головна"
          edgeWidth={wp(100)}
          drawerContent={(props) => <CustomDrawer {...props} />}
        >
          <Drawer.Screen name="Головна" component={Home} options={{ gestureEnabled: false }} />
          <Drawer.Screen name="Історія" component={MyTrips} />
          <Drawer.Screen name="Мій профіль" component={Profile} />
          {/* <Drawer.Screen name="Мої бонуси" component={MyBonuses} /> */}
          <Drawer.Screen name="Мої місця" component={MyPlaces} />
          <Drawer.Screen name="Мої картки" component={MyCards} />
          <Drawer.Screen name="Оплата" component={Payment} />
          <Drawer.Screen name="Права" component={Rights} />
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login" headerMode={{ headerVisible: false }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="SMS" component={SMS} />
          <Stack.Screen name="AuthRights" component={Rights} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default observer(MainNavigation);
