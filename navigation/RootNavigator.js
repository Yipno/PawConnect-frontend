import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

export default function RootNavigator() {
  const user = useSelector(state => state.user.value);
  return (
    <NavigationContainer>{user.token ? <AppNavigator /> : <AuthNavigator />}</NavigationContainer>
  );
}
