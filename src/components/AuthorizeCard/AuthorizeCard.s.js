import { StyleSheet } from 'react-native';
import { appColors } from '../../styles/global';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    paddingHorizontal: wp(5),
    justifyContent: 'center',
    flex: 1,
    width: wp(100),
    paddingVertical: hp(5),
  },
  scroll: {
    height: hp(75),
    width: wp(100),
  },
  paymentBlock: {
    borderColor: appColors.main,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 35,
    borderRadius: 5,
    margin: 10,
  },
  paymentImage: {
    maxWidth: 120,
    height: 37,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 5,
  },
  alertMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoIcon: {
    position: 'absolute',
    top: 10,
    right: wp(5),
  },
  button: {},
  confirmButton: { marginTop: 10 },
  description: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginBottom: 10,
  },
  registerLabel: {
    marginTop: hp(2),
  },
  checkboxText: { width: wp(75), marginLeft: wp(5) },
  emptyMessage: {
    fontSize: wp(5),
    paddingHorizontal: wp(10),
    textAlign: 'center',
  },
});
