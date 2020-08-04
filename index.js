import { AppRegistry, Platform } from 'react-native';
import App from './App';

AppRegistry.registerComponent('pilot_taxi_ternopil', () => App);

if (Platform.OS === 'web') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('pilot_taxi_ternopil', { rootTag });
}
