import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appColors } from '../../styles/global';

export default StyleSheet.create({
  buttonIcon: {
    width: 30,
    height: 30,
    resizeMode: 'stretch',
  },
  button: {
    backgroundColor: appColors.main,
    position: 'absolute',
    width: 50,
    top: 40,
    left: 40,
    zIndex: 100,
    padding: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
