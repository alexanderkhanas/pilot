import { StyleSheet } from 'react-native';
import { appColors } from '../../styles/global';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    marginTop: hp(2),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  additionalInfo: { alignSelf: 'flex-start' },
  textContainer: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 15,
    marginLeft: 20,
    borderBottomWidth: 1,
    paddingVertical: 2,
    width: wp(60),
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    alignItems: 'flex-end',
  },
  text: {
    fontSize: wp(3.5),
    marginTop: 5,
    marginLeft: 5,
  },
  header: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  button: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    backgroundColor: '#ff9900',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  buttonText: {
    textTransform: 'uppercase',
  },
  deleteIcon: {
    position: 'absolute',
    bottom: 20,
    right: 0,
  },
  renderLeft: {
    backgroundColor: '#c21414',
    marginTop: hp(2),
    flex: 1,
    width: wp(100),
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
  },
  editItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editItemIcon: { marginRight: 15 },
});
