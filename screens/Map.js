import { StyleSheet, TouchableOpacity, View, Alert, Platform, Linking, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import useTheme from '../hooks/useTheme';
import MapView, { Callout, Marker } from 'react-native-maps';
import CustomModal from '../components/ui/CustomModal';
import * as Location from 'expo-location';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getReports } from '../reducers/animals';
import { getDistanceLabel } from '../helpers/getDistance';
import moment from 'moment'; //module for Format date
import 'moment/locale/fr';
moment.locale('fr');

const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

export default function MapScreen({ navigation, visible, onClose }) {
  const { colors } = useTheme();
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
        // console.log('currentloc', currentLocation);
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
        // console.log('status', status);
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
    // console.log('useeffect centermap', currentLocation);
  }, [currentLocation]);

  // UPDATES USER LOCATION WHEN ONPRESS LOCATE BUTTON
  const onPressLocation = () => {
    if (currentLocation) {
      centerMap(currentLocation);
    }
    // console.log('onpress centermap', currentLocation);
  };

  /*--- 2. MARKERS SETUP ---*/

  // GET DATA FROM REDUCER
  const user = useSelector((state) => state.user.value);
  const animals = useSelector((state) => state.animals.value);
  const establishments = useSelector((state) => state.establishments.value);

  // OK console.log('map - animals', animals);
  // console.log('map - establishments', establishments);

  // MARKER LOCATION
  const [locations, setLocations] = useState([]);

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

      const newLocations = establishments?.map((data) => {
        const establishmentLocation = {
          latitude: data.location.lat,
          longitude: data.location.long,
        };
        const distanceLabel = getDistanceLabel(currentLocation, establishmentLocation);
        return { ...data, distance: distanceLabel };
      });
      setLocations(newLocations);

      // DISTANCE FOR AGENT TO ANIMALS
    } else {
      const newLocations = animals?.map((data) => {
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

  // MARKERS COLORS

  // PRIORITY LABEL
  const priorityValues = {
    urgent: {
      label: 'Urgent',
      color: '#FECACA',
    },
    important: {
      label: 'Important',
      color: '#FED7AA',
    },
    modere: {
      label: 'Modéré',
      color: '#BFDBFE',
    },
    faible: {
      label: 'Faible',
      color: '#BBF7D0',
    },
  };

  // MARKERS DATA ON CONDITION
  let markers;
  // CIVIL USER MARKERS: ESTABLISHMENTS
  if (user.role === 'civil') {
    markers = establishments?.map((data, i) => {
      const distance = currentLocation
        ? getDistanceLabel(currentLocation, {
            latitude: data.location.lat,
            longitude: data.location.long,
          })
        : '';
      return (
        <Marker
          key={i}
          coordinate={{ latitude: data.location.lat, longitude: data.location.long }}
          title={`${data.name} - ${distance}`}
          description={`${data.address.street} ${data.address.zipCode} ${data.address.city} `}
        />
      );
    });
  } else {
    // AGENT MARKERS: ANIMALS
    markers = locations
      .filter((e) => e.status === 'nouveau')
      .map((data, i) => {
        // DISPLAY PRIORITY AND COLORS ON MARKERS
        const priorityData = priorityValues[data?.priority] ?? {
          label: 'Priority',
          color: '#FECACA',
        };

        const reportPinColor = priorityData.color;

        // DISPLAY STATUS INFO
        const hasHandlers = data.currentHandler !== null;
        const reportStatus = hasHandlers ? `Pris en charge` : 'En attente de prise en charge';

        return (
          <Marker
            key={i}
            pinColor={reportPinColor}
            onCalloutPress={() => navigation.navigate('Signalements')}
            coordinate={{ latitude: data.location.lat, longitude: data.location.long }}
            title={`${data.title} à ${data.distance} (${moment(data.date).fromNow()})`}
            description={`Statut : ${reportStatus} | Priorité : ${priorityData.label} `}
          />
        );
      });
  }

  let civilReportMarkers;
  if (user.role === 'civil') {
    // console.log(animals);

    civilReportMarkers = animals?.map((data, i) => {
      const hasHandlers = data.currentHandler !== null;
      // console.log('hashandlers', hasHandlers);

      // DISPLAY STATUS INFO
      const reportStatus = hasHandlers
        ? `Pris en charge par ${data?.establishment?.name}`
        : 'En attente de prise en charge';

      return (
        <Marker
          key={i}
          coordinate={{ latitude: data.location.lat, longitude: data.location.long }}
          pinColor={`${hasHandlers ? '#00FF00' : '#FF8000'}`}
          title={`${data.title} (${moment(data.date).fromNow()})`}
          description={`${reportStatus}`}
          onCalloutPress={() => navigation.navigate('Signalements')}
        ></Marker>
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
            onPress={onPressLocation}
          >
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
          onPress={onPressLocation}
        >
          <Ionicons name='locate-sharp' size={32} color='black' />
        </TouchableOpacity>
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
        showsMyLocationButton={false}
      >
        {markers}
        {civilReportMarkers}
      </MapView>
      {userMapButtons}
    </View>
  );
}

const styles = StyleSheet.create({});
