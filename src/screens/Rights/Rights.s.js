import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
export default StyleSheet.create({
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: wp(5),
    paddingVertical: 5,
  },
  title: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: wp(6),
    fontWeight: 'bold',
  },
  subtitle: { marginTop: 50, marginBottom: 10, fontSize: wp(4), fontWeight: 'bold' },
  bodyText: {
    fontWeight: '300',
    fontSize: wp(3),
  },
});
