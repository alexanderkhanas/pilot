import { StyleSheet } from 'react-native';
import { appColors } from '../../styles/global';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: wp(12),
    backgroundColor: '#202020',
    flexGrow: 1,
    paddingVertical: 20,
    paddingTop: hp(20),
  },
  button: {
    borderRadius: 25,
    paddingVertical: hp(1),
    width: wp(76),
    marginTop: hp(3),
  },
  logo: {
    marginBottom: hp(3),
  },
  buttonText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: wp(5),
    textAlign: 'center',
    color: '#EEEEEE',
  },
  input: {
    backgroundColor: appColors.rare,
    paddingVertical: hp(2),
    paddingHorizontal: wp(6),
    width: wp(91),
  },
  disabled: {
    backgroundColor: '#aaa',
  },
  wrongInput: {
    borderBottomColor: 'red',
  },
  wrapperStyle: {
    backgroundColor: appColors.secondary,
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: wp(85),
    height: wp(75),
    resizeMode: 'stretch',
  },
});
