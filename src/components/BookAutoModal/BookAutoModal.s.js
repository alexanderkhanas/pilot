import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appColors } from '../../styles/global';

export default StyleSheet.create({
  container: {
    width: wp(100),
    borderBottomColor: '#404040',
    borderBottomWidth: 1,
    zIndex: 1000000,
    height: hp(100),
    backgroundColor: appColors.main,
    position: 'absolute',
    zIndex: 2,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  topContainer: {
    flexDirection: 'row',
    width: wp(85),
    justifyContent: 'space-between',
    paddingVertical: hp(2),
  },
  switchButton: {
    paddingVertical: hp(2),
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: wp(6),
    width: wp(33),
  },
  activeSwitchButton: {
    paddingVertical: hp(2),
    width: wp(33),
    paddingHorizontal: wp(6),
    borderRadius: 25,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  switchButtonText: {
    fontSize: wp(4) > 15 ? 15 : wp(4),
    fontWeight: 'bold',
    color: '#fff',
  },
  switchButtonTextActive: {
    fontSize: wp(4) > 15 ? 15 : wp(4),
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    padding: 10,
  },
  closeImage: {
    width: wp(6),
    height: wp(6),
  },
});
