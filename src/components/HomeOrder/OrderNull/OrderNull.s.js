import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  item: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    flex: 4,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    height: hp(7),
    justifyContent: 'center',
  },
  submitContainer: { flexDirection: 'row', borderRadius: 30, overflow: 'hidden' },
  arrow: {
    width: wp(6),
    height: wp(6),
  },
  arrowContainer: {
    position: 'absolute',
    bottom: hp(20),
    left: wp(50) - wp(6) / 2 - hp(1) / 2,
    padding: hp(1),
    zIndex: 100,
  },
  orderCarBtn: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: '#000',
    height: hp(7),
  },
  orderBtnText: {
    fontSize: 14,
  },
  changeTypeBtn: { marginTop: 20 },
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
  },
  buttonText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: hp(2.5) > 25 ? 25 : hp(2.5),
  },
  coloredContainer: {
    width: '50%',
    position: 'absolute',
    height: '100%',
  },
  placesContainer: {
    flexDirection: 'row',
    width: '70%',
    // position: 'absolute',
    // top: -hp(7),
    borderRadius: 25,
    alignItems: 'center',
    zIndex: 10000000,
    marginBottom: 20,
    borderWidth: 1.5,
    paddingVertical: hp(1.2),
  },
  place: {
    flex: 1,
  },
  placeText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  itemText: { textAlign: 'center', fontWeight: 'bold' },
  otherIconContainer: {
    position: 'absolute',
    top: -hp(6.5),
    right: -10,
    height: 50,
    width: 50,
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 30,
    overflow: 'hidden',
  },
});
