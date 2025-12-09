import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './TabBar';

import Map from '../screens/Map';
import Report from '../screens/Report';
import Profile from '../screens/Profile';
import MyReports from '../screens/MyReports';


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

  {/* Screen caché */}
  <Tab.Screen
    name="MyReports"
    component={MyReports} // screen “Mes Signalements”
    options={{
      tabBarButton: () => null, // pas de bouton dans le tab
      tabBarVisible: false,
    }}
  />


    </Tab.Navigator>
  );
}
