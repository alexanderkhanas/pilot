import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appColors } from '../../styles/global';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    width: wp(100),
    height: hp(100),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#40404080',
  },
  modal: {
    paddingHorizontal: wp(7),
    paddingVertical: hp(3),
    backgroundColor: appColors.anotherMain,
    borderRadius: 20,
    justifyContent: 'center',
    width: wp(85),
    maxWidth: 600,
  },
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: hp(1),
    marginTop: 15,
  },
  btnDisabled: {
    backgroundColor: '#999',
  },
  input: {},
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  row: {
    flexDirection: 'row',
    zIndex: 10,
    justifyContent: 'space-between',
  },
});
