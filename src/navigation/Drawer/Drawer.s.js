import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { appColors } from '../../styles/global';

export default StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: hp(2.5),
    width: wp(68.1),
    // minWidth: wp(68.1),
  },
  userIcon: {
    width: wp(16),
    height: wp(16),
    borderRadius: 75,
  },
  userInfoContainer: {
    marginTop: hp(1),
    flexDirection: 'row',
    marginHorizontal: wp(4),
    paddingBottom: hp(2),
    borderBottomWidth: 2,
    zIndex: 20,
  },
  userInfo: {
    marginLeft: wp(3),
    marginTop: hp(1.25),
    flex: 1,
  },
  navIcon: {
    marginRight: wp(8),
  },
  editIcon: {
    marginTop: hp(1.5),
  },
  userName: {
    color: '#fff',
    fontSize: wp('5%'),
    width: '90%',
  },
  userPhone: {
    marginTop: hp(1),
    fontSize: wp('3%'),
    color: '#ccc',
  },
  drawerItem: {
    padding: hp(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerItemTitle: {
    color: '#fff',
    fontSize: 15,
  },
  drawerItemImage: {
    marginRight: 15,
    width: wp(10),
    height: wp(10),
  },
  footer: {
    position: 'absolute',
    width: '90%',
    alignItems: 'center',
    marginHorizontal: '5%',
    bottom: hp(1),
    justifyContent: 'center',
    borderTopWidth: 2,
  },
  orderCar: {
    paddingVertical: hp(2),
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: hp(2),
  },
  orderCarText: {
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: wp('5.5%'),
  },
  orderCarNum: {
    color: '#FF9900',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: wp('7.5%'),
  },
  orderCarImage: {
    width: wp('20'),
    height: wp('20'),
  },
  drawerContent: {
    zIndex: 0,
    flex: 1,
  },
  drawerContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#000',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    width: wp(32.1),
    height: hp(100),
    left: wp(68.1),
  },

  items: {
    flex: 1,
  },
  buttonContainer: {
    marginHorizontal: wp(8),
    paddingTop: hp(10),
    borderTopWidth: 1,
  },
  phoneIcon: {
    marginTop: 10,
  },
  footerText: {
    fontSize: wp(4),
    textAlign: 'center',
  },
  settingsIcon: {
    position: 'absolute',
    right: -7,
    padding: 7,
  },
  defaultUserAvatarContainer: {
    width: wp(16),
    height: wp(16),
    padding: wp(2.5),
    alignItems: 'center',
    borderRadius: 75,
  },
});
