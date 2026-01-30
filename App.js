import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View } from 'react-native';
import './global.css';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import user from './reducers/user';
import animals from './reducers/animals';
import establishments from './reducers/establishments';
import notifications from './reducers/notifications';
import RootNavigator from './navigation/RootNavigator';

const store = configureStore({
  reducer: { user, animals, establishments, notifications },
});

export default function App() {
  const loaded = useFonts({
    'Manrope-Regular': require('./assets/fonts/manrope.regular.otf'),
    'Manrope-Bold': require('./assets/fonts/manrope.bold.otf'),
  });

  if (!loaded) return null;

  return (
    // RootNavigator => NAVIGATEUR RACINE qui a acces au reducer
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({});
