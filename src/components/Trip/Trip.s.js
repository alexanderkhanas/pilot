import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default StyleSheet.create({
  item: {
    marginBottom: hp(2),
    position: 'relative',
    padding: 10,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  mainContent: {
    flexDirection: 'row',
    flex: 1,
  },
  itemIcon: {
    width: wp(12),
    height: wp(12),
  },
  goIcon: {
    marginTop: hp(2.5),
    alignSelf: 'flex-end',
  },
  itemInfo: {
    marginHorizontal: wp(4),
  },
  itemDate: {
    fontSize: wp(5),
  },
  itemWay: {
    marginTop: 15,
    flexDirection: 'row',
  },
  wayIcon: {
    width: wp(2),
    margin: 5,
    alignItems: 'center',
  },
  blueCircle: {
    backgroundColor: 'blue',
  },
  bigCircle: {
    width: 10,
    height: 10,
    marginBottom: 5,
    borderRadius: 20,
  },
  circle: {
    width: 5,
    marginBottom: 5,
    height: 5,
    borderRadius: 20,
  },
  blackCircle: {
    backgroundColor: 'black',
  },
  greenCircle: {
    backgroundColor: 'green',
  },
  itemPoints: {
    marginLeft: 5,
    justifyContent: 'space-between',
  },
  wayText: {
    textTransform: 'uppercase',
  },
  endPoint: {
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  priceContainer: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    position: 'absolute',
    right: 10,
  },
  price: {
    fontSize: wp(7) > 30 ? 30 : wp(7),
    marginRight: 5,
  },
  moneyIcon: {
    marginLeft: 5,
    width: wp(7),
    height: wp(7),
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  itemDetails: {
    textTransform: 'uppercase',
    fontSize: wp(5),
    fontWeight: 'bold',
  },
  deleteIcon: {
    width: wp(10),
    height: wp(10),
  },
  button: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    backgroundColor: '#ff9900',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  buttonText: {
    textTransform: 'uppercase',
    fontWeight: '500',
  },
});
