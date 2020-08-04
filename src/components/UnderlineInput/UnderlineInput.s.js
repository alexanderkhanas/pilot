import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
export default StyleSheet.create({
  input: {
    borderBottomWidth: 0.5,
    fontSize: 16,
  },
  label: {
    // textTransform: 'uppercase',
    fontSize: wp(4) > 20 ? 20 : wp(4),
    letterSpacing: 0.7,
  },
});
