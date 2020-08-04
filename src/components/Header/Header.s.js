import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FF9900',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    height: hp(12),
  },
  icon: {
    padding: 10,
  },
  headerBackIcon: {
    width: wp('5'),
    height: wp('5'),
  },
  headerTitle: {
    fontSize: wp('7'),
    fontWeight: 'bold',
  },
  headerIcon: {
    width: wp(12),
    height: wp(12),
  },
});
