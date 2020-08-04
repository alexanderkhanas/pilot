import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  autocompleteItem: {
    padding: 10,
    borderBottomColor: '#CCCccc',
    borderBottomWidth: 1,
    height: 50,
    zIndex: 10000,
    backgroundColor: '#CCCCCC80',
  },
  input: {
    textAlign: 'center',
    marginBottom: hp(1),
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  listStyle: {
    height: hp(40),
    minHeight: 150,
    zIndex: 1000,
    borderColor: '#cccccc00',
  },
  container: {
    flex: 1,
  },
  listContainer: {
    backgroundColor: '#CCC',
  },
  autocompleteCont: {},
});
