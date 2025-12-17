import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import CustomModal from '../ui/CustomModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { getDistanceLabel } from '../../helpers/getDistance';
import moment from 'moment'; //module for Format date
import 'moment/locale/fr';
moment.locale('fr');

export default function ReportDetail({
  visible,
  onClose,
  report,
  agent,
  description,
  onChangeDescription,
  onActualiser,
}) {
  const [statut, setStatut] = useState(false);
  const [cours, setCours] = useState(false);
  const [cloturer, setCloturer] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distanceLabel, setDistanceLabel] = useState('');

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

  const onPress = () => {
    setStatut(!statut);
  };

  const handleCours = () => {
    setCours(!cours);
    setCloturer(false);
  };

  const handleCloturer = () => {
    setCloturer(!cloturer);
    setCours(false);
  };

  useEffect(() => {
    if (!visible) {
      setCours(false);
      setCloturer(false);
      setStatut(false);
    }
  }, [visible]);
  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      fullscreen
      statut
      agent=''
      content={
        report ? (
          <ScrollView>
            <View className='w-11/12 justify-center'>
              <View className='w-full aspect-[4/3] my-4'>
                <Image
                  source={{ uri: report.photoUrl }}
                  className='w-full h-full rounded-2xl object-cover'
                />
              </View>

              {/* Title */}
              <Text className='text-xl font-bold mb-2 text-left'>{report.title}</Text>

              {/* Place & Date */}
              <View className='w-full flex-row justify-between mb-3'>
                {distanceLabel ? (
                  <Text className='mb-2 text-gray-700'>Distance: {distanceLabel}</Text>
                ) : (
                  <Text className='mb-2 text-gray-500'>Calcul de la distance...</Text>
                )}
                <Text>{moment(report.date).format('LLL')}</Text>
              </View>

              {/* Priority
            <View className='bg-deepSage/20 border border-deepSage rounded-2xl px-3 py-1 self-start mb-4'>
              <Text>{report.priority}</Text>
            </View> */}

              {/* Tag */}
              <View className='flex-row flex-wrap mb-4'>
               {Array.isArray(report.state) && report.state.map((tag, index) => (
              <View
              key={index}
               className='bg-softOrange border-[1px] border-orange-500 rounded-2xl mr-2 mb-2 px-3 py-1'
                >
               <Text className='text-white font-bold'>{tag}</Text>
               </View>
                ))}
              </View>

              {/* Description */}
              <View>
                <Text className='text-base text-gray-800 leading-5 text-justify'>
                  {report.desc}
                </Text>
              </View>
              {agent === 'agent' && (
                <View>
                  <View className='flex-col justify-center items-center gap-2 mt-2 w-full'>
                    <TouchableOpacity
                      className='border border-gray rounded-2xl h-12 w-full flex-row items-center justify-between px-4'
                      onPress={onPress}
                    >
                      <Text>Statut</Text>
                      <Ionicons name='chevron-down-outline' color='#000000' size={20} />
                    </TouchableOpacity>
                    {statut && (
                      <View className='border border-gray rounded-2xl  w-full flex-col justify-center items-center '>
                        <TouchableOpacity
                          className={
                            cours
                              ? 'rounded-t-2xl h-12 w-full flex-col justify-center items-center bg-deepSage'
                              : 'h-12 w-full rounded-t-2xl flex-col justify-center items-center'
                          }
                          onPress={() => handleCours()}
                        >
                          <Text className={cours ? 'text-white' : 'text-black'}>En cours</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className={
                            cloturer
                              ? 'border-gray border-t-[1px] rounded-b-2xl h-12 w-full flex-col justify-center items-center bg-deepSage'
                              : 'border-gray border-t-[1px] h-12 w-full flex-col justify-center items-center'
                          }
                          onPress={() => handleCloturer()}
                        >
                          <Text className={cloturer ? 'text-white' : 'text-black'}>Clôturer</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <TextInput
                      className='border border-gray rounded-2xl h-[150] w-full  justify-between px-4 mb-2'
                      placeholder='Ajouter une description'
                      onChangeText={onChangeDescription}
                      value={description}
                    ></TextInput>
                    <TouchableOpacity
                      className='border border-gray bg-deepSage rounded-2xl h-12 w-full flex-col justify-center items-center  px-4'
                      onPress={() => onActualiser({ description, cours, cloturer })}
                    >
                      <Text className='text-white'>Actualiser</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        ) : (
          <Text>Aucun détail disponible.</Text>
        )
      }
    />
  );
}
