import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  driverInfoContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  driverIcon: {
    width: wp(30),
    height: wp(30),
  },
  driverName: {
    fontSize: wp(4),
    marginBottom: 7,
  },
  driverNumber: {
    fontSize: wp(5),
  },
});
