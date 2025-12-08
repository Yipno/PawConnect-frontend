import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { StyleSheet, Text, View } from 'react-native';
import './global.css';
import AppNavigator from './navigation/AppNavigator';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import user from './reducers/user';
import animals from './reducers/animals';

const store = configureStore({
  reducer: { user, animals },
});

export default function App() {
  const loaded = useFonts({ Manrope: require('./assets/fonts/Manrope-VariableFont.ttf') });

  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titre: {
    fontSize: 48,
    textAlign: 'center',
  },
});
