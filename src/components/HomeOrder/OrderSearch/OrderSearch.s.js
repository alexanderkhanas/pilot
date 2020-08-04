import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { flexDirection: 'column', alignItems: 'center', flex: 1 },
  text: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: '500',
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
