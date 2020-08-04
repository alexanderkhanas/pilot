import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  scrollStyle: {
    marginBottom: 15,
  },
  container: {},
  button: {
    marginTop: hp(3),
    width: wp(90),
    alignSelf: 'center',
  },
  buttonContainer: {
    flex: 1,
    alignSelf: 'center',
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  group: {
    width: '30%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(3),
  },
});
