import { StyleSheet } from 'react-native';
import { appColors } from '../../styles/global';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#202020',
    width: wp(100),
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: wp(12),
    justifyContent: 'center',
    paddingTop: hp(15),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(76),
  },
  button: {
    borderRadius: 25,
    backgroundColor: appColors.main,
    paddingVertical: hp(1),
    width: wp(76),
    marginTop: hp(2.5),
    // marginBottom: hp(10),
  },
  buttonText: {
    color: '#eee',
    fontSize: wp(5),
    fontWeight: 'bold',
  },
  logo: {
    marginBottom: hp(4),
  },
  input: {
    width: wp(76),
    fontSize: wp(4),
    textAlign: 'center',
  },
  disabled: {
    backgroundColor: '#aaa',
  },
  image: {
    width: wp(85),
    height: wp(75),
    resizeMode: 'stretch',
  },
});
