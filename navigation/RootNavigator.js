import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import ReportStack from './ReportStack';

export default function RootNavigator() {
  const user = useSelector(state => state.user.value);
  return (
    // Verification si token dans redux => Go dans l'appli sinon => route Auth
    <NavigationContainer>{user.token ? <ReportStack /> : <AuthNavigator />}</NavigationContainer>
    // <NavigationContainer>
    //   {/* <AppNavigator /> */}
    //   <ReportStack />
    // </NavigationContainer>
  );
}