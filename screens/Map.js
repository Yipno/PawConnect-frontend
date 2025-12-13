import { StyleSheet, TouchableOpacity, View, Alert, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import useTheme from '../hooks/useTheme';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReports } from '../reducers/animals';
import { getDistanceLabel } from '../helpers/getDistance';

const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

// TEST DATA MARKER - ESTABLISHMENTS (ATTENTE REDUCER)
const markerData = [
  { name: 'Asso1', lat: 48.859, long: 2.347 },
  { name: 'Asso2', lat: 45.758, long: 4.835 },
  { name: 'Asso3', lat: 43.282, long: 5.405 },
];

export default function MapScreen({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  /* -------------------- 1) GEOLOCATION -------------------- */

  const [currentLocation, setCurrentLocation] = useState(null);
  const mapRef = useRef(null);

  // Demande permission + récupère position
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const result = await Location.requestForegroundPermissionsAsync();
        const status = result?.status;

        if (status !== 'granted') {
          Alert.alert(
            'Permission refusée',
            'Veuillez accepter de partager votre localisation pour utiliser Paw Connect',
            [
              {
                text: 'Paramétrer',
                onPress: () => {
                  if (Platform.OS === 'ios') Linking.openURL('app-settings:');
                  else Linking.openSettings();
                },
              },
              { text: 'OK' },
            ]
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        if (!isMounted) return;

        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (err) {
        console.error('Location error:', err);
        Alert.alert('Erreur', 'Impossible de récupérer la localisation.');
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Centre la map
  const centerMap = (loc, duration = 400) => {
    if (!loc || !mapRef.current) return;

    mapRef.current.animateToRegion(
      {
        latitude: loc.latitude,
        longitude: loc.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      duration
    );
  };

  // Recentre dès qu’on a une position
  useEffect(() => {
    if (currentLocation) centerMap(currentLocation, 400);
  }, [currentLocation]);

  const onPressLocation = () => {
    if (currentLocation) centerMap(currentLocation, 400);
  };

  /* -------------------- 2) REDUX DATA -------------------- */

  // Valeurs safe par défaut (évite 100% des crash)
  const user = useSelector((state) => state.user?.value) ?? {};
  const animals = useSelector((state) => state.animals?.value) ?? [];

  /* -------------------- 3) TEST DISPATCH -------------------- */

  const handleData = () => {
    const newAnimal = [
      {
        location: { lat: 43.249954, long: 5.421111 },
        date: '2025-12-09T10:30:00.000Z',
        animalType: 'chat',
        title: 'Chat errant',
        desc: 'Chat errant aperçu près du parc',
        state: ['affamé'],
        photoUrl: '',
        status: 'nouveau',
        reporter: { $oid: '6936fe386fb328f6ec180ea6' },
        handlers: [],
        history: [],
      },
    ];

    dispatch(getReports(newAnimal));
  };

  /* -------------------- 4) LOCATIONS + DISTANCES -------------------- */

  // On fabrique une liste “locations” calculée (avec distance)
  // useMemo => recalcul uniquement si role / animals / currentLocation changent
  const locations = useMemo(() => {
    if (!currentLocation) return [];

    // CIVIL => établissements
    if (user?.role === 'civil') {
      return markerData.map((data) => {
        const establishmentLocation = { latitude: data.lat, longitude: data.long };
        const distance = getDistanceLabel(currentLocation, establishmentLocation);
        return { ...data, distance };
      });
    }

    // AGENT => animaux
    return (animals ?? []).map((data) => {
      const animalLocation = {
        latitude: data?.location?.lat,
        longitude: data?.location?.long,
      };

      // si location incomplète, distance vide
      const distance =
        animalLocation.latitude && animalLocation.longitude
          ? getDistanceLabel(currentLocation, animalLocation)
          : '';

      return { ...data, distance };
    });
  }, [user?.role, animals, currentLocation]);

  /* -------------------- 5) MARKERS -------------------- */

  const markers = useMemo(() => {
    // CIVIL => markers établissements (markerData)
    if (user?.role === 'civil') {
      return markerData.map((data, i) => {
        const distance = currentLocation
          ? getDistanceLabel(currentLocation, { latitude: data.lat, longitude: data.long })
          : '';

        return (
          <Marker
            key={`est-${i}`}
            coordinate={{ latitude: data.lat, longitude: data.long }}
            title={data.name}
            description={distance}
          />
        );
      });
    }

    // AGENT => markers animals (on filtre "nouveau")
    return (locations ?? [])
      .filter((e) => e?.status === 'nouveau')
      .map((data, i) => {
        const lat = data?.location?.lat;
        const long = data?.location?.long;

        // si pas de coords => on skip
        if (!lat || !long) return null;

        return (
          <Marker
            key={`ani-${i}`}
            coordinate={{ latitude: lat, longitude: long }}
            title={data?.animalType ?? 'Animal'}
            description={data?.distance ?? ''}
          />
        );
      })
      .filter(Boolean);
  }, [user?.role, currentLocation, locations]);

  /* -------------------- 6) BUTTONS -------------------- */

  const userMapButtons =
    user?.role === 'civil' ? (
      <View className='absolute flex-col bottom-40 right-14'>
        <TouchableOpacity
          className='rounded-full bg-white items-center justify-center size-10 start-80 bottom-5'
          onPress={onPressLocation}
        >
          <Ionicons name='locate-sharp' size={32} color='black' />
        </TouchableOpacity>

        <Button
          width={320}
          bg={colors.danger}
          textColor={colors.offwhite}
          title='Signaler un animal'
          onPress={() => navigation.navigate('Report', { currentLocation })}
        />
      </View>
    ) : (
      <View className='absolute flex-col bottom-40 right-14'>
        <TouchableOpacity
          className='absolute rounded-full bottom-40 right-10 bg-white items-center'
          onPress={onPressLocation}
        >
          <Ionicons name='locate-sharp' size={32} color='black' />
        </TouchableOpacity>

        <Button
          width={320}
          bg={colors.softOrange}
          textColor={colors.offwhite}
          title='Données animaux reducers'
          onPress={handleData}
        />
      </View>
    );

  /* -------------------- 7) RENDER -------------------- */

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
        showsMyLocationButton={false}
      >
        {markers}
      </MapView>

      {userMapButtons}
    </View>
  );
}

const styles = StyleSheet.create({});
