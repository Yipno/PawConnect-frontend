import { StyleSheet, Text, TouchableOpacity, View, Alert, Platform, Linking } from 'react-native';
import SquaredButton from '../components/ui/SquaredButton';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import useTheme from '../hooks/useTheme';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { login } from "../reducers/user";

export default function MapScreen() {
  const { colors } = useTheme();

  // GET DATA FROM REDUCER
  // const user = useSelector((state) => state.user.value);

  // TEST DATA USER
  const userData = { lastname: 'Doe', firstname: 'John', role: 'civil' };

  // TEST DATA MARKER OK
    const markerData = [
    { name: "Asso1", latitude: 48.859, longitude: 2.347 },
    { name: "Asso2", latitude: 45.758, longitude: 4.835 },
    { name: "Asso3", latitude: 43.282, longitude: 5.405 },
  ];

  const markers = markerData.map((data, i) => {
    return <Marker key={i} coordinate={{ latitude: data.latitude, longitude: data.longitude }} title={data.name} />;
  });

  // USER LOCATION
  const [currentLocation, setCurrentLocation] = useState(null);
  console.log('current loc', currentLocation);
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
  // OK console.log('user.role', userData.role);

  // USER MAP (PENDING : MARKERS + NAVIGATION TO REPORT)
  if (userData.role === 'civil') {
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
        <View className='absolute flex-col bottom-40 right-10'>
          <TouchableOpacity
            className='rounded-full bg-white items-center justify-center size-10 start-96 bottom-5'
            onPress={updateUserLocation}
          >
            <Ionicons name='locate-sharp' size={32} color='black' />
          </TouchableOpacity>
            <Button
              bg={colors.softOrange}
              textColor={colors.offwhite}
              title='Signaler un animal'
              onPress={() => alert('signalement')}
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
        ></MapView>
        <TouchableOpacity
          className='absolute rounded-full bottom-40 right-10 bg-white items-center'
          onPress={updateUserLocation}
        >
          <Ionicons name='locate-sharp' size={32} color='black' />
        </TouchableOpacity>
      </>
    );
  }

  return (
  <View style={{ flex: 1 }}>{userMap}</View>
  );
}

const styles = StyleSheet.create({});
