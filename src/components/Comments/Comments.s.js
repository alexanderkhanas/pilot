import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  commentContainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  star: {
    width: wp(3),
    height: wp(3),
    marginLeft: wp(1),
  },
  starContainer: {
    flexDirection: 'row',
  },
  commentInfo: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentBody: {
    width: wp(60),
  },
  text: {
    fontSize: wp(4.5),
  },
  author: {
    fontSize: wp(4),
    fontWeight: 'bold',
  },
});
