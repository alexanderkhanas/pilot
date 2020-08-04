import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  icon: {
    marginTop: 20,
    alignSelf: 'center',
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: hp(5),
  },
  title: {
    fontSize: wp(7),
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
  },
  description: {
    fontSize: wp(5),
    fontWeight: '500',
    marginBottom: 10,
  },
  cardViewContainer: {
    marginTop: hp(3),
  },
  button: {
    paddingVertical: hp(2) > 15 ? 15 : hp(2),
  },
});
