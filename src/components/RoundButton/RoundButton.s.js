import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  buttonText: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: hp(1) > 17 ? 17 : hp(1),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
});
