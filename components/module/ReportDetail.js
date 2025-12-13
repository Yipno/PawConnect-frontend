import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import CustomModal from '../ui/CustomModal';
import * as Location from 'expo-location';
import { getDistanceLabel } from '../../helpers/getDistance';
import moment from 'moment'; //module for Format date
import 'moment/locale/fr';
moment.locale('fr');

export default function ReportDetail({ visible, onClose, report }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distanceLabel, setDistanceLabel] = useState('');
  const [loading, setLoading] = useState(true);

  // Date formatting function
  const formatDate = (dateString) => {
    return moment(dateString).fromNow();
  };

  const formatDateHistory = (dateString) => {
    return moment(dateString).format('LLL');
  };

  //add the current location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission refusée pour accéder à la localisation');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  // Calculate distance label when current location or report location changes
  useEffect(() => {
    if (currentLocation && report?.location) {
      setDistanceLabel(
        getDistanceLabel(currentLocation, {
          latitude: report.location.lat,
          longitude: report.location.long,
        })
      );
    }
  }, [currentLocation, report]);

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      content={
        report ? (
          <View>
            <View className='w-full aspect-[4/3] mb-6 mt-20 max-h-[400px] relative'>
              <Image
                source={{ url: report.photoUrl }}
                className='w-full h-full rounded-2xl object-cover'
                resizeMode="cover"
                accessibilityLabel={`Photo du signalement: ${report.title}`}
                onLoadStart={() => setLoading(true)} // Show loading indicator
                onLoadEnd={() => setLoading(false)}
                onError={() => setLoading(false)}
              />
              {loading && (
                <View className='absolute inset-0 flex items-center justify-center z-10'>
                  {/* Loading page */}
                  <ActivityIndicator size='large' color='#FFA000' />
                </View>
              )}
            </View>

            {/* Title */}
            <Text className='text-xl font-bold mb-4 text-left break-words'>{report.title}</Text>

            {/* Distance & Date */}
            <View className='w-full flex-row justify-between mb-3'>
              {distanceLabel ? (
                <Text className='mb-2 text-gray-700'>Distance: {distanceLabel}</Text>
              ) : (
                <Text className='mb-2 text-gray-500'>Calcul de la distance...</Text>
              )}
              <Text>{formatDate(report.date)}</Text>
            </View>

            {/* Tag */}
            <View className='flex-row flex-wrap gap-2 mb-4 break-words'>
              {report.state.map((tag, index) => (
                <View
                  key={index}
                  className='bg-softOrange border-softOrange rounded-2xl px-3 py-1 self-start'
                >
                  <Text className='text-white font-bold'>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Description */}
            <View>
              <Text
                className='text-base text-gray-800 leading-normal mb-4 break-words'
                style={{ textAlign: 'justify' }}
              >
                {report.desc}
              </Text>
            </View>

            <View>
              {report.history?.[0] && (
                <Text className='text-base font-medium text-gray-800 leading-relaxed break-words'>
                  {`${report.history[0].action} le : ${formatDateHistory(
                    report.history[0].date
                  )} \n par ${report.history[0].handler}`}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <Text>Aucun détail disponible.</Text>
        )
      }
      fullscreen={true}
    />
  );
}
