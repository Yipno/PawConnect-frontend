import { StyleSheet, Text, TouchableOpacity, View, Alert, Platform, Linking } from 'react-native';
import SquaredButton from '../components/ui/SquaredButton';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import useTheme from '../hooks/useTheme';
import MapView, { Callout, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/user';
import { getReports } from '../reducers/animals';

const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

export default function MapScreen({ navigation }) {
  const { colors } = useTheme();

  const dispatch = useDispatch();
  const [locations, setLocations] = useState([]);

  // GET DATA FROM REDUCER
  const user = useSelector((state) => state.user.value);
  const animals = useSelector((state) => state.animals.value);

  // TEST DATA MARKER OK - ESTABLISHMENTS
  const markerData = [
    { name: 'Asso1', latitude: 48.859, longitude: 2.347 },
    { name: 'Asso2', latitude: 45.758, longitude: 4.835 },
    { name: 'Asso3', latitude: 43.282, longitude: 5.405 },
  ];

  // SEND DATA TO REDUCER
  const handleData = () => {
    const newAnimal = {
      location: {
        lat: 43.249954,
        long: 5.421111,
      },
      date: '2025-12-09T10:30:00.000Z',
      animalType: 'chat',
      desc: 'Chat errant aperçu près du parc',
      state: ['affamé'],
      photoUrl: '',
      status: 'nouveau',
      reporter: {
        $oid: '6936fe386fb328f6ec180ea6',
      },
      handlers: [],
      history: [],
    };
    dispatch(getReports(newAnimal));
    console.log('reducers', animals);
    if (animals.length > 0) {
      // console.log('animals reducers: ', animals);
      console.log('animals date: ', animals[0].date);
      console.log('animals type: ', animals[0].animalType);
      console.log('animal lat: ', animals[0].location.lat);
      console.log('animal long: ', animals[0].location.long);
      console.log('animal state: ', animals[0].state.toString());
    }
  };

  // CALCULATE DISTANCE BETWEEN USER AND MARKER
  const toRadius = (deg) => {
    return deg * (Math.PI / 180);
  };

  const convertCoordsToKm = (origin, target) => {
    const R = 6371;

    const latRadians = toRadius(target.latitude - origin.latitude) / 2;
    const longRadians = toRadius(target.longitude - origin.longitude) / 2;

    const a =
      Math.pow(Math.sin(latRadians), 2) +
      Math.cos(toRadius(origin.latitude)) *
        Math.cos(toRadius(target.latitude)) *
        Math.pow(Math.sin(longRadians), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(2);
  };

  const updateDistances = (userCoordinates) => {
    const newLocations = animals.map((data) => {
      const animalLocation = {
      latitude: data.location.lat,
      longitude: data.location.long,
    };
      return { ...data, distance: convertCoordsToKm(userCoordinates, animalLocation) };
    });

    setLocations(newLocations);
  };

  // MARKERS DATA ON CONDITION
  let markers;
  if (user.role === 'civil') {
    markers = markerData.map((data, i) => {
      return (
        <Marker
          key={i}
          coordinate={{ latitude: data.latitude, longitude: data.longitude }}
          title={data.animalType}
          description={data.distance}
        />
      );
    });
  } else {
    markers = locations.map((data, i) => {
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

  // USER LOCATION
  const [currentLocation, setCurrentLocation] = useState(null);
  // console.log('current loc', currentLocation);
  const mapRef = useRef(null);

  // GET USER PERMISSION & LOCATION OK - SANS GESTION DU REFUS
  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        // OK console.log('coords', location.coords);
        setCurrentLocation(location.coords);
        updateDistances(location.coords);

      }
    })();
  }, []);

  // CENTERS MAP ON USER LOCATION WITH USEREF & ANIMATETOREGION
  useEffect(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  }, [currentLocation]);

  // UPDATES USER LOCATION ONPRESS LOCATE BUTTON
  const updateUserLocation = () => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
    console.log('update', currentLocation);
  };

  // DISPLAY MARKER DEPENDING ROLE
  /*
  let userMarker;
  if (userData.role === 'civil') {
    userMarker = (
      {establishmentsMarkers}
    );
  } else {
    userMarker =(
      {animalsMarkers});
  };*/

  // DISPLAY MAP DEPENDING ROLE
  let userMap;
  // console.log('user.role', user.role);

  // USER MAP (PENDING : MARKERS)
  if (user.role === 'civil') {
    userMap = (
      <>
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
        <View className='absolute flex-col bottom-40 right-16'>
          <TouchableOpacity
            className='rounded-full bg-white items-center justify-center size-10 start-72 bottom-5'
            onPress={updateUserLocation}
          >
            <Ionicons name='locate-sharp' size={32} color='black' />
          </TouchableOpacity>
          <Button
            width={310}
            bg={colors.softOrange}
            textColor={colors.offwhite}
            title='Signaler un animal'
            onPress={() => handleData()}
          />
        </View>
      </>
    );
  } else {
    // ESTABLISHMENTS MAP (PENDING : MARKERS)
    userMap = (
      <>
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
        <TouchableOpacity
          className='absolute rounded-full bottom-40 right-10 bg-white items-center'
          onPress={() => (updateUserLocation(), handleData())}
        >
          <Ionicons name='locate-sharp' size={32} color='black' />
        </TouchableOpacity>
      </>
    );
  }

  return <View className='flex-1'>{userMap}</View>;
}

const styles = StyleSheet.create({});
