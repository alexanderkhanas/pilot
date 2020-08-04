import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appColors } from '../../styles/global';

export default StyleSheet.create({
  container: {
    height: hp(91),
  },
  input: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: wp(50),
    marginLeft: wp(25),
    textAlign: 'center',
    padding: hp(2),
    marginBottom: hp(1),
  },

  bottomContainer: {
    backgroundColor: appColors.main,
    position: 'absolute',
    width: wp(100),
    paddingVertical: hp(3),
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
  },
  scrollContainer: {
    height: hp(65),
  },
  bottomButtonWrapper: {
    width: wp(100),
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  bottomArrows: {
    textAlignVertical: 'center',
  },
  bottomButton: {
    backgroundColor: '#000',
    borderRadius: 30,
    padding: hp(1.5),
    paddingHorizontal: wp(10),
  },
  bottomButtonText: {
    color: '#fff',
    fontSize: wp(5),
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  inlineInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: wp(100),
    maxHeight: hp(7.5),
    alignItems: 'center',
  },
  picker: {
    flex: 1,
    height: hp(7),
    color: '#fff',
  },
  pickerItem: {
    height: hp(7),
    fontSize: wp(3),
    color: '#fff',
  },
  pickerWrapper: {
    flex: 1,
    maxWidth: wp(32.5),
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    height: hp(7.5),
    position: 'relative',
  },
  bottomInput: {
    fontSize: 16,
    flex: 1,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    maxWidth: wp(45),
    textAlign: 'center',
    padding: hp(2),
    paddingBottom: hp(1.5),
    height: hp(7.5),
  },
  lastInput: {
    fontSize: 16,
    flex: 1,
    borderBottomColor: '#000',
    borderBottomWidth: 1,
    textAlign: 'center',
    padding: hp(2),
    paddingBottom: hp(1.5),
    height: hp(7.5),
    width: wp(88),
  },
  arrow: {
    width: wp(6),
    height: wp(6),
  },
  arrowContainer: {
    position: 'absolute',
    left: wp(50) - hp(1) - wp(6) / 2,
    padding: hp(1),
    zIndex: 240000000,
  },
  emptyMsgContainer: {
    paddingHorizontal: wp(15),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyMsgText: {
    fontSize: wp(6) > 50 ? 50 : wp(6),
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
