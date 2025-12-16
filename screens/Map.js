import { StyleSheet, TouchableOpacity, View, Alert, Platform, Linking, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import useTheme from '../hooks/useTheme';
import MapView, { Callout, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReports } from '../reducers/animals';
import { getDistanceLabel } from '../helpers/getDistance';
import NotificationsList from '../components/NotificationsList';

const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

// TEST DATA MARKER - ESTABLISHMENTS (ATTENTE REDUCER)
const markerData = [
  { name: 'Asso1', lat: 48.859, long: 2.347 },
  { name: 'Asso2', lat: 45.758, long: 4.835 },
  { name: 'Asso3', lat: 43.282, long: 5.405 },
];

export default function MapScreen({ navigation }) {
  const { colors } = useTheme();
  // NOTIFICATIONS TOGGLE
  const [showNotifications, setShowNotifications] = useState(false);
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  const dispatch = useDispatch();

  /*--- 1. GEOLOCATION SETUP ---*/

  // USER LOCATION
  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null);

  // GET USER PERMISSION & LOCATION OK - SANS GESTION DU REFUS
  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        // OK console.log('coords', location.coords);
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        console.log('currentloc', currentLocation);
      } else {
        Alert.alert(
          'Permission refusée',
          'Veuillez accepter de partager votre localisation pour utiliser Paw Connect',
          [
            {
              text: 'Paramétrer',
              onPress: () => {
                // A REVOIR
                // OPENS APP SETTINGS
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        console.log('status', status);
        return;
      }
    })();
  }, []);

  // FUNCTION CENTERMAP
  const centerMap = (currentLocation, duration) => {
    if (!currentLocation || !mapRef.current) {
      return;
    } else {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        duration
      );
    }
  };

  // CENTERS MAP ON USER LOCATION WITH USEREF & ANIMATETOREGION
  useEffect(() => {
    if (currentLocation) {
      centerMap(currentLocation, 400);
    }
    console.log('useeffect centermap', currentLocation);
  }, [currentLocation]);

  // UPDATES USER LOCATION WHEN ONPRESS LOCATE BUTTON
  const onPressLocation = () => {
    if (currentLocation) {
      centerMap(currentLocation);
    }
    console.log('onpress centermap', currentLocation);
  };

  /*--- 2. MARKERS SETUP ---*/

  // GET DATA FROM REDUCER
  const user = useSelector(state => state.user.value);
  const animals = useSelector(state => state.animals.value);
  // const establishments = useSelector((state) => state.establishments.value);

  // MARKER LOCATION
  const [locations, setLocations] = useState([]);

  // SEND DATA TO ANIMALS REDUCER
  // const handleData = () => {
  //   const newAnimal = [
  //     {
  //       location: {
  //         lat: 43.249954,
  //         long: 5.421111,
  //       },
  //       date: '2025-12-09T10:30:00.000Z',
  //       animalType: 'chat',
  //       desc: 'Chat errant aperçu près du parc',
  //       state: ['affamé'],
  //       photoUrl: '',
  //       status: 'nouveau',
  //       reporter: {
  //         $oid: '6936fe386fb328f6ec180ea6',
  //       },
  //       handlers: [],
  //       history: [],
  //     },
  //   ];
  //   dispatch(getReports(newAnimal));
  //   // console.log('reducers', animals);
  //   if (animals.length > 0) {
  //     // console.log('animals reducers: ', animals);
  //     console.log('animals date: ', animals[0].date);
  //     console.log('animals type: ', animals[0].animalType);
  //     console.log('animal lat: ', animals[0].location.lat);
  //     console.log('animal long: ', animals[0].location.long);
  //   }
  // };

  /*--- 3. DISTANCE CALCULATION ---*/

  // CALCULATE DISTANCE BETWEEN USER AND MARKER
  useEffect(() => {
    if (!currentLocation) {
      setLocations([]);
      return;
    }

    // DISTANCE FOR CIVIL TO ESTABLISHMENTS
    if (user.role === 'civil') {
      // REDUCER CODE
      /*
      const newLocations = establishments.map((data) => {
        const establishmentLocation = {
          latitude: data.location.lat,
          longitude: data.location.long,
        };
        const distanceLabel = getDistanceLabel(currentLocation, establishmentLocation);
        return { ...data, distance: distanceLabel };
      });
      */
      const newLocations = markerData.map(data => {
        const establishmentLocation = {
          latitude: data.lat,
          longitude: data.long,
        };
        const distanceLabel = getDistanceLabel(currentLocation, establishmentLocation);
        return { ...data, distance: distanceLabel };
      });

      setLocations(newLocations);

      // DISTANCE FOR AGENT TO ANIMALS
    } else {
      const newLocations = animals.map(data => {
        const animalLocation = {
          latitude: data.location.lat,
          longitude: data.location.long,
        };
        const distanceLabel = getDistanceLabel(currentLocation, animalLocation);
        return { ...data, distance: distanceLabel };
      });

      setLocations(newLocations);
    }
  }, [user?.role, animals, currentLocation]);

  // console.log('location', locations);

  /*--- 4. MAP DISPLAY ---*/

  // MARKERS DATA ON CONDITION
  let markers;
  // CIVIL USER MARKERS: ESTABLISHMENTS
  if (user.role === 'civil') {
    // WAITING FOR ESTABLISHMENTS DATA TO UPDATE (LINE 127)
    // TEST DATA MAPPING ON MARKERDATA
    markers = markerData.map((data, i) => {
      const distance = currentLocation
        ? getDistanceLabel(currentLocation, { latitude: data.lat, longitude: data.long })
        : '';
      return (
        <Marker
          key={i}
          coordinate={{ latitude: data.lat, longitude: data.long }}
          title={data.name}
          description={distance}
        />
      );
    });
  } else {
    // AGENT MARKERS: ANIMALS
    markers = locations
      .filter(e => e.status === 'nouveau')
      .map((data, i) => {
        return (
          <Marker
            key={i}
            coordinate={{ latitude: data.location.lat, longitude: data.location.long }}
            title={data.animalType}
            description={data.distance}
          />
        );
      });
  }

  // DISPLAY USER MAP BUTTONS DEPENDING ROLES
  let userMapButtons =
    user?.role === 'civil' ? (
      <View className='absolute w-full items-center bottom-36'>
        <View className='w-full items-end px-4'>
          <TouchableOpacity
            className='rounded-full bg-white items-center justify-center size-12 '
            onPress={onPressLocation}>
            <Ionicons name='locate-sharp' size={36} color='black' />
          </TouchableOpacity>
        </View>
        <Button
          width='w-9/12'
          bg={colors.danger}
          textColor={colors.offwhite}
          title='Signaler un animal'
          // ouvre la page de signalement avec la position actuelle
          onPress={() => navigation.navigate('Report', { currentLocation })}
        />
      </View>
    ) : (
      <View className='absolute w-full bottom-36 items-end p-4'>
        <TouchableOpacity
          className='rounded-full size-12 bg-white justify-center items-center'
          onPress={onPressLocation}>
          <Ionicons name='locate-sharp' size={32} color='black' />
        </TouchableOpacity>
        {/* <Button
          bg={colors.softOrange}
          textColor={colors.offwhite}
          title='Données animaux reducers'
          onPress={handleData}
        /> */}
      </View>
    );

  // MAP RETURN
  return (
    <View className='flex-1'>
      <MapView
        ref={mapRef}
        mapType='standard'
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 48.866667,
          longitude: 2.333333,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton={false}>
        {markers}
      </MapView>
      {/* BUTTON TOGGLE NOTIFICATIONS */}
      <View className='absolute top-16 right-5 flex-row justify-end'>
        <TouchableOpacity
          className='bg-white rounded-full items-center justify-center size-16 border border-danger'
          onPress={toggleNotifications}>
          <Ionicons name='notifications' size={32} color={colors.danger} />
        </TouchableOpacity>
        <View className='absolute top-0 right-0 bg-danger rounded-full items-center justify-center px-1.5 py-0.5'>
          <Text className='text-offwhite bg-danger font-manrope text-xs font-extrabold'>2</Text>
        </View>
      </View>
      {/* NOTIFICATIONS LIST DISPLAY */}
      {showNotifications && <NotificationsList />}
      {userMapButtons}
    </View>
  );
}

const styles = StyleSheet.create({});
