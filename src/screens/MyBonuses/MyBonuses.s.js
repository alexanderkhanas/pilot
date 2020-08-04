import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    height: hp(91),
    width: wp(100),
  },
  image: {
    marginTop: hp(5),
  },
  bonusesText: {
    color: '#CDCDCD',
    fontSize: wp(6),
    textAlign: 'center',
    marginTop: hp(2),
  },
  enterPromoText: {
    textAlign: 'center',
    fontSize: wp(6),
    marginTop: hp(11),
  },
  promoCode: {
    textAlign: 'center',
    fontSize: wp(7),
    marginTop: hp(6),
  },
  button: {
    backgroundColor: '#000',
    width: wp(80),
    marginLeft: wp(10),
    borderRadius: 30,
    paddingVertical: wp(1.5),
    marginTop: hp(6),
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: wp(6),
  },
  birthdayView: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FF7A00',
    paddingBottom: hp(5),
    paddingTop: hp(1.5),
    width: wp(100),
  },
  birthdayText: { fontSize: wp(3.5), textAlign: 'center', marginBottom: hp(3) },
  birthdayNote: { fontSize: wp(3.25), textAlign: 'center' },
});
