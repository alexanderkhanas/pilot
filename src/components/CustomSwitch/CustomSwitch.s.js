import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    marginHorizontal: 4,
  },
  iconContainer: {
    borderBottomWidth: 2,
  },
  icon: {
    padding: 3,
  },
  iconButton: {
    width: hp(8) > 60 ? 60 : hp(8),
    alignItems: 'center',
  },
});
