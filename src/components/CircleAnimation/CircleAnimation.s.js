import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    backgroundColor: '#00000000',
    position: 'absolute',
    top: 0,
    left: 0,
    width: wp(100),
    height: hp(100),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
  },
  circle: {
    width: wp(100),
    backgroundColor: '#000',
    height: wp(100),
    borderRadius: hp(50),
    position: 'absolute',
  },
});
