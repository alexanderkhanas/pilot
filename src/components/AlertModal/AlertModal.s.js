import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 10000,
    flex: 1,
    backgroundColor: '#40404080',
    width: wp(100),
    height: hp(100),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(8),
    paddingVertical: hp(10),
  },
  modal: {
    paddingVertical: wp(9) > 35 ? 35 : wp(9),
    paddingHorizontal: wp(7),
    borderRadius: 20,
    width: wp(90) > 800 ? 800 : wp(90),
  },
  title: {
    fontSize: wp(5.5) > 26 ? 26 : wp(5.5),
    fontWeight: '500',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: wp(4) > 18 ? 18 : wp(4),
  },
  btnContainer: {
    flexDirection: 'row',
    marginTop: 40,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 10,
    maxHeight: 30,
    marginHorizontal: 4,
  },
  buttonText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: wp(3) > 16 ? 16 : wp(3),
    color: '#fff3f3',
  },
});
