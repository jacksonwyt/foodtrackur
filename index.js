import 'react-native-url-polyfill/auto';
import {registerRootComponent} from 'expo';
import AppWrapper from './src/App'; // Changed to AppWrapper

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(AppWrapper); // Changed to AppWrapper
