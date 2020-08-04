import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: hp(2.3),
    justifyContent: 'space-around',
    marginVertical: hp(1),
    borderRadius: 9,
  },
  cardLogo: {
    width: wp(17) > 120 ? 120 : wp(17),
    resizeMode: 'stretch',
    height: hp(6) > 60 ? 60 : hp(6),
  },
  cardName: {
    fontSize: wp(5),
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 20,
  },
  cardNum: {
    flex: 1,
    textAlign: 'right',
  },
});
