import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    height: hp(100),
    position: 'absolute',
  },
  bgWrapper: {
    flex: 1,
    position: 'absolute',
    height: hp(100),
    width: wp(100),
  },
});
