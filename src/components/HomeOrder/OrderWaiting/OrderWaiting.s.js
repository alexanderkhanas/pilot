import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', alignItems: 'flex-start' },
  title: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flex: 1,
  },
  icon: {
    width: 40,
  },
});
