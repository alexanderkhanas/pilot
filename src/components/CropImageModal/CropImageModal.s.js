import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  cropContainer: {
    backgroundColor: '#27272799',
    width: wp(100),
    height: hp(100),
    justifyContent: 'space-between',
  },
  cropHeader: {
    alignItems: 'flex-end',
    backgroundColor: '#5f5f5f',
    padding: 20,
  },
  cropFooter: {
    padding: 20,
    backgroundColor: '#5f5f5f',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  crop: {
    minWidth: wp(70),
    minHeight: hp(40),
    maxWidth: wp(90),
    maxHeight: hp(80),
    alignSelf: 'center',
  },
  saveButton: {
    padding: 5,
  },
  saveText: {
    fontSize: wp(5),
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});
