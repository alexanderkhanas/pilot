import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10000,
    flex: 1,
    backgroundColor: '#40404080',
    width: wp(100),
    height: hp(100),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(8),
    paddingVertical: hp(10),
  },
  modal: {
    paddingVertical: wp(9) > 45 ? 45 : wp(9),
    paddingHorizontal: wp(7) > 35 ? 35 : wp(7),
    borderRadius: 20,
  },
  title: {
    fontSize: wp(5) > 30 ? 30 : wp(5),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
});
