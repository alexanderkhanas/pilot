import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    height: hp(91),
  },
  avatarContainer: {
    width: wp(100),
    paddingVertical: hp(2),
    alignItems: 'center',
    borderRadius: 75,
  },
  defaultUserAvatarContainer: {
    width: wp(30),
    height: wp(30),
    padding: wp(5),
    alignItems: 'center',
    borderRadius: 75,
  },
  userAvatar: {
    width: wp(30),
    height: wp(30),
    borderRadius: 75,
  },
  userInfoContainer: {
    marginTop: 10,
    paddingHorizontal: wp(5),
  },
  inputStyle: {
    padding: 5,
    fontSize: hp(3) < 15 ? 15 : hp(3),
    marginBottom: hp(3),
  },
  footerButton: {
    width: wp(100),
    paddingHorizontal: wp(10),
    marginTop: hp(5),
  },
  wrongInput: {
    borderColor: 'red',
  },
  disabled: {
    backgroundColor: '#aaa',
  },
  horizontalInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp(1),
  },
  rowText: {
    fontWeight: 'bold',
    fontSize: wp(5) > 35 ? 35 : wp(5),
  },
  cropContainer: {
    backgroundColor: '#27272790',
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
  },
  crop: {
    minWidth: wp(70),
    minHeight: hp(40),
    maxWidth: wp(90),
    maxHeight: hp(80),
    alignSelf: 'center',
  },
  sideIconContainer: {
    paddingLeft: wp(5),
    paddingVertical: 5,
  },
});
