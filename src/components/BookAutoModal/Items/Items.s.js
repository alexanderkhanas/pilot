import { StyleSheet } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { appColors } from '../../../styles/global';

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingTop: hp(5),
    width: wp(90),
    justifyContent: 'flex-end',
    height: hp(17),
  },
  group: {
    height: hp(17),

    paddingTop: hp(7),
    width: wp(90),
    alignItems: 'flex-end',
  },
  switchContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: wp(4),
    marginBottom: 10,
  },
  switchItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    flex: 1,
  },
  // group: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'flex-start',
  //   position: 'relative',
  //   marginTop: hp(1.75),
  //   backgroundColor: '#fff',
  //   paddingRight: 10,
  // },
  itemContainer: {
    width: wp(70),
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc80',
  },
  input: {
    padding: hp(0.8),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderBottomWidth: 1,
    fontSize: 15,
  },
  iconContainer: {
    width: hp(8),
    height: hp(8),
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: hp(4),
  },
  icon: {
    // backgroundColor: '#000',
  },
  numInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreMoneyView: {
    flex: 1,
    height: '75%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderColor: '#000',
  },
  moreMoneyItem: {
    padding: wp(2.75),
    paddingHorizontal: 5,
  },
  moreMoneyItemText: {
    textAlignVertical: 'center',
  },
  carOptionsView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  closeImage: {
    width: wp(6),
    height: wp(6),
  },
  mapIconSecondary: {
    marginRight: 10,
  },
  button: { position: 'absolute', top: 46, right: 40, padding: 10 },
  deliveryItemsView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: hp(3),
    height: hp(10),
  },
  amountInput: { textAlign: 'center', fontSize: hp(3) < 15 ? 15 : hp(3), padding: 0 },
  productInput: {
    // flexGrow: 1,
    // flexShrink: 1,
    textAlign: 'center',
    width: wp(50),
  },
  itemIcon: {
    alignSelf: 'center',
    paddingHorizontal: wp(2),
  },
  addNewIcon: {
    marginTop: hp(2),
    alignSelf: 'center',
  },
  carsNumView: {
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  numInputPlus: {
    fontSize: 37,
    paddingHorizontal: wp(1.5),
    borderLeftColor: '#000',
    borderLeftWidth: 1,
  },
  numInputMinus: {
    fontSize: 37,
    paddingHorizontal: wp(1.5),
    borderRightColor: '#000',
    borderRightWidth: 1,
  },
  timeOutput: {
    flexGrow: 1,
    width: 100,
  },
  timeNum: {
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'bottom',
    includeFontPadding: false,
    flex: -1,
    paddingBottom: 10,
  },
  timeText: {
    fontSize: 12.5,
    textAlign: 'center',
    textAlignVertical: 'top',
    includeFontPadding: false,
    flex: -1,
  },
  btns: {
    width: wp(85),
  },
  btnsHor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  btn: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    width: '45%',
  },
  btnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  listContainer: {
    height: 150,
  },
  imageView: {
    flexDirection: 'row',
  },
  carLvlView: {
    flex: 1,
    height: '75%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderColor: '#000',
  },
  carLvl: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  carLvlText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  optionGroup: {
    flexDirection: 'row',
    flexGrow: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  optionText: {
    fontSize: 20,
    paddingVertical: 3,
  },
  clearTimeText: {
    textAlign: 'right',
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.2,
  },
  footer: {
    paddingVertical: 20,
  },
  lineContainer: {
    position: 'absolute',
    height: hp(65),
    alignItems: 'center',
    marginTop: hp(8),
  },
  line: {
    height: hp(9),
    width: 2,
    backgroundColor: '#404040',
  },
  timePickContainer: {
    flexDirection: 'row',
    width: wp(70),
    justifyContent: 'space-between',
    height: hp(5),
  },
});
