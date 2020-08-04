import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  icon: {
    width: 40,
  },
  text: {
    fontSize: wp(4) > 20 ? 20 : wp(4),
    marginLeft: 20,
  },
  footer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  footerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  centerCarIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 50,
  },
  centerCarIcon: {
    padding: 8,
  },
  cancelButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  cancelText: {
    color: '#ff3535',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
