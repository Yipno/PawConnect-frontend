import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './TabBar';

import Map from '../screens/Map';
import Report from '../screens/Report';
import ReportStack from './ReportStack';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name='Map'
        component={Map}
        options={{ tabBarLabel: 'Carte', tabBarIcon: 'map-outline' }}
      />

      <Tab.Screen
        name='Signalements'
        component={Report}
        options={{ tabBarLabel: 'Signalements', tabBarIcon: 'file-tray-full-outline' }}
      />

      <Tab.Screen
        name='Menu'
        component={Profile}
        options={{ tabBarLabel: 'Menu', tabBarIcon: 'ellipsis-horizontal-outline' }}
      />
    </Tab.Navigator>
  );
}
