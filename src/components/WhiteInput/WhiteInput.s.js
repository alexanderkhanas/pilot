import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appColors } from '../../styles/global';

export default StyleSheet.create({
  input: {
    backgroundColor: appColors.rare,
    paddingVertical: hp(2),
    paddingHorizontal: wp(6),
    borderRadius: 30,
    borderBottomWidth: 1,
  },
});
