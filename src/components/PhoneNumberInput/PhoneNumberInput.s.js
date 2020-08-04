import { StyleSheet } from 'react-native';
import { appColors } from '../../styles/global';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: hp(1),
    alignItems: 'center',
    marginTop: 20,
  },
  prefix: {
    fontSize: 17,
    alignSelf: 'center',
    marginBottom: 1.5,
    padding: wp(2),
    borderRadius: 35,
  },
  inputContainer: {
    flexDirection: 'row',
    position: 'relative',
    flex: 1,
    marginLeft: wp(6),
  },
  input: {
    fontSize: 17,
    flex: 1,
  },
});
