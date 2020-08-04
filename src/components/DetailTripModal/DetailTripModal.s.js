import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  modalContainer: {
    height: hp(90),
    backgroundColor: '#fab300',
  },
  infoIcon: {
    width: wp(7),
    height: wp(7),
    marginRight: 5,
  },
  tripInfo: {
    paddingVertical: 13,
    backgroundColor: '#fab300',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    height: hp(8),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driver: {
    height: hp(25),
  },
  tripInfoTop: {
    height: hp(18),
  },
});
