import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appColors } from '../../styles/global';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: wp(12),
    // backgroundColor: '#000',
    flexGrow: 1,
    paddingVertical: 20,
    paddingTop: hp(5),
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: { marginTop: hp(1) },
  firstNameInputsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(91),
    marginTop: hp(2),
  },
  firstNameInput: {
    width: wp(42.5),
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: 25,
    textAlign: 'center',
  },
  surnameInput: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: 25,
    width: wp(91),
    marginTop: hp(1),
    textAlign: 'center',
  },
  disabled: { backgroundColor: '#aaa' },
  wrongInput: { borderColor: 'red' },
  button: {
    borderRadius: 25,
    paddingVertical: hp(1),
    width: wp(92),
    marginTop: hp(3),
  },
  image: {
    width: wp(85),
    height: wp(75),
    resizeMode: 'stretch',
  },
  buttonText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: wp(5),
    textAlign: 'center',
    color: '#EEEEEE',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 5,
    width: '100%',
    alignSelf: 'center',
  },
  checkboxText: {
    marginLeft: 30,
    width: '70%',
  },
});
