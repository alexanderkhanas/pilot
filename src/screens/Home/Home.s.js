import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appColors } from '../../styles/global';

export default StyleSheet.create({
  mapWrapper: { height: hp(75) },
  keyboardAvoider: { width: wp(100) },
  homeMapStyle: {
    height: hp(100),
    width: wp(100),
    position: 'relative',
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderRightWidth: 0,
  },
  container: {
    height: hp(100),
  },
  searchContainer: {
    height: hp(30),
    position: 'absolute',
    bottom: 0,
    flex: 1,
    zIndex: 10,
    justifyContent: 'space-around',
    width: wp(100),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(3),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: wp(8),
  },
  placesContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: '60%',
    position: 'absolute',
    bottom: hp(23.5),
    borderRadius: 25,
    alignItems: 'center',
    zIndex: 5,
    marginBottom: 20,
  },
  place: {
    flex: 1,
    paddingVertical: hp(1.5),
  },
  placeText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  homePlaceContainer: {
    height: hp(5),
    justifyContent: 'center',
    borderWidth: 2,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderRightWidth: 0,
  },
  workPlaceContainer: {
    height: hp(5),
    justifyContent: 'center',
    borderWidth: 2,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderLeftWidth: 0,
  },
});
