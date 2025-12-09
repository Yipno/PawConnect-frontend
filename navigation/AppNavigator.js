import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from './TabBar';
import { useSelector } from 'react-redux';
import Map from '../screens/Map';
import Report from '../screens/Report';
import Profile from '../screens/Profile';
import MyReports from '../screens/MyReports';

const Tab = createBottomTabNavigator();

// Wrapper pour afficher un screen différent selon le rôle du user (civil/agent)
// en cours d'élaboration, par defaut sur MyReports tant que user.role est null
function SignalementsWrapper() {
  const user = useSelector((state) => state.user.value);
  console.log('USER ROLE ===>', user.role);
  if (user.role === 'agent') {
    return <Report />;
  } else {
    return <MyReports />;
  }
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name='Map'
        component={Map}
        options={{ tabBarLabel: 'Carte', tabBarIcon: 'map-outline' }}
      />

      <Tab.Screen
        name='Signalements'
        component={SignalementsWrapper}
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
