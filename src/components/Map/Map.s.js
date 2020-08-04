import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  icon: {
    padding: 8,
  },
  iconContainer: {
    zIndex: 1000,
    borderRadius: 50,
  },
  buttonsContainer: {
    position: 'absolute',
    top: 40,
    right: 40,
  },
});
