import { StyleSheet } from 'react-native';
import { appColors } from '../../styles/global';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  paymentBlock: {
    borderColor: appColors.main,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 35,
    borderRadius: 5,
    margin: 10,
  },
  paymentImage: {
    maxWidth: 120,
    height: 37,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 5,
  },
  alertMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoIcon: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  button: {
    marginTop: 20,
  },
});
