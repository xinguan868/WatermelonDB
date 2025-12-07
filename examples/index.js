import {AppRegistry, View, Text, LogBox} from 'react-native';
import {name as appName} from './app.json';
// import App from './src/WatermelonDBAndroid';
// import App from './src/WatermelonDBSimple';
import App from './src/WaterLocalStorage';

LogBox.ignoreAllLogs(true);

AppRegistry.registerComponent(appName, () => App);