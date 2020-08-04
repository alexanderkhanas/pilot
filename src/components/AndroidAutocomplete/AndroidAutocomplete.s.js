import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  autocompleteItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  andrAutocomplete: {
    width: wp(85),
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 10000,
    maxHeight: 300,
  },
});
