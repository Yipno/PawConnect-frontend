import { StyleSheet, Text, View } from 'react-native';
import SquaredButton from '../components/ui/SquaredButton';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useEffect, useState, useRef } from 'react';

export default function MapScreen() {
  const [currentLocation, setCurrentLocation] = useState(null);
  console.log('current loc', currentLocation);
  const mapRef = useRef(null);

  const [tempCoordinates, setTempCoordinates] = useState(null);
  const [newPlace, setNewPlace] = useState('');

  // GET USER PERMISSION & LOCATION
  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        console.log(location);
        console.log('coords', location.coords);
        setCurrentLocation(location.coords);
      }
    })();
  }, []);

  // CENTERED MAP ON USER LOCATION WITH USEREF & ANIMATETOREGION
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

  return (
    <View style={{ flex: 1 }}>
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
        showsMyLocationButton
        // MOVES MYLOCATIONBUTTON (bouton non natif à créer)
        mapPadding={{ top: 30, right: 0, bottom: 0, left: 0 }}
      >
        {currentLocation && <Marker coordinate={currentLocation} title='Votre position' />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({});
