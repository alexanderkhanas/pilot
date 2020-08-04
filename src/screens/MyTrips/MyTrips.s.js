import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  myTripsContainer: {
    height: hp(100),
  },

  itemsContainer: {
    padding: 5,
  },
  emptyMsgContainer: {
    paddingHorizontal: wp(15),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: hp(85),
  },
  emptyMsgText: {
    fontSize: wp(6) > 50 ? 50 : wp(6),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  moreButton: { paddingBottom: 30, alignItems: 'center', justifyContent: 'center' },
  moreButtonText: { fontSize: 22 },
});
