import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from '../screens/CameraScreen';
import ReportScreen from '../screens/ReportScreen';
import AppNavigator from './AppNavigator';
import MyReports from '../screens/MyReports';

const Stack = createNativeStackNavigator();

export default function ReportStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='MapNav' component={AppNavigator} />
      <Stack.Screen name='Report' component={ReportScreen} />
      <Stack.Screen name='Camera' component={CameraScreen} />
      <Stack.Screen name='MyReports' component={MyReports} />
    </Stack.Navigator>
  );
}
