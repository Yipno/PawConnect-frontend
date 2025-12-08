import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View } from 'react-native';
import './global.css';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import user from './reducers/user';
import animals from './reducers/animals';
import RootNavigator from './navigation/RootNavigator';

const store = configureStore({
  reducer: { user, animals },
});

export default function App() {
  const loaded = useFonts({ Manrope: require('./assets/fonts/Manrope-VariableFont.ttf') });

  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({});
