import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import CustomModal from '../ui/CustomModal';
import * as Location from 'expo-location';
import { getDistanceLabel } from '../../helpers/getDistance';
import moment from 'moment';
import 'moment/locale/fr';
import { Ionicons } from '@expo/vector-icons';

moment.locale('fr');

export default function ReportDetailUnified({
  visible,
  onClose,
  report,
  agent, // "agent" ou autre
  description,
  onChangeDescription,
  onActualiser,
}) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loadingImg, setLoadingImg] = useState(true);

  // UI agent
  const [statutOpen, setStatutOpen] = useState(false);
  const [cours, setCours] = useState(false);
  const [cloturer, setCloturer] = useState(false);

  // Reset UI agent quand on ferme
  useEffect(() => {
    if (!visible) {
      setStatutOpen(false);
      setCours(false);
      setCloturer(false);
      // (optionnel) reset description côté parent si tu veux :
      // onChangeDescription?.('');
    }
  }, [visible]);

  // Demande localisation (une seule fois)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const location = await Location.getCurrentPositionAsync({});
        if (!mounted) return;

        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (e) {
        // pas bloquant
        console.log('Location error (modal):', e);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const formatDateFromNow = (dateString) => (dateString ? moment(dateString).fromNow() : '');
  const formatDateHistory = (dateString) => (dateString ? moment(dateString).format('LLL') : '');

  // Distance calculée
  const distanceLabel = useMemo(() => {
    const lat = report?.location?.lat;
    const long = report?.location?.long;

    if (
      !currentLocation ||
      typeof currentLocation.latitude !== 'number' ||
      typeof currentLocation.longitude !== 'number' ||
      typeof lat !== 'number' ||
      typeof long !== 'number'
    ) {
      return '';
    }

    try {
      return getDistanceLabel(currentLocation, { latitude: lat, longitude: long }) ?? '';
    } catch (e) {
      console.log('getDistanceLabel error:', e);
      return '';
    }
  }, [currentLocation, report?.location?.lat, report?.location?.long]);

  // Handlers agent
  const toggleStatut = () => setStatutOpen((p) => !p);

  const handleCours = () => {
    setCours((p) => !p);
    setCloturer(false);
  };

  const handleCloturer = () => {
    setCloturer((p) => !p);
    setCours(false);
  };

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      fullscreen={true}
      content={
        report ? (
          <View>
            {/* Image */}
            <View className='w-full aspect-[4/3] mb-6 mt-20 max-h-[400px] relative'>
              <Image
                source={{ uri: report.photoUrl }}
                className='w-full h-full rounded-2xl object-cover'
                resizeMode='cover'
                accessibilityLabel={`Photo du signalement: ${report.title ?? ''}`}
                onLoadStart={() => setLoadingImg(true)}
                onLoadEnd={() => setLoadingImg(false)}
                onError={() => setLoadingImg(false)}
              />
              {loadingImg && (
                <View className='absolute inset-0 flex items-center justify-center z-10'>
                  <ActivityIndicator size='large' color='#FFA000' />
                </View>
              )}
            </View>

            {/* Title */}
            <Text className='text-xl font-bold mb-4 text-left break-words'>
              {report.title ?? 'Signalement'}
            </Text>

            {/* Distance & Date */}
            <View className='w-full flex-row justify-between mb-3'>
              {distanceLabel ? (
                <Text className='mb-2 text-gray-700'>Distance: {distanceLabel}</Text>
              ) : (
                <Text className='mb-2 text-gray-500'>Distance indisponible</Text>
              )}
              <Text>{formatDateFromNow(report.date)}</Text>
            </View>

            {/* Tags (state) */}
            <View className='flex-row flex-wrap gap-2 mb-4 break-words'>
              {(report.state ?? []).map((tag, index) => (
                <View
                  key={`${tag}-${index}`}
                  className='bg-softOrange border-softOrange rounded-2xl px-3 py-1 self-start'
                >
                  <Text className='text-white font-bold'>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Description */}
            <Text
              className='text-base text-gray-800 leading-normal mb-4 break-words'
              style={{ textAlign: 'justify' }}
            >
              {report.desc ?? ''}
            </Text>

            {/* History (optionnel) */}
            {report.history?.[0] && (
              <Text className='text-base font-medium text-gray-800 leading-relaxed break-words mb-6'>
                {`${report.history[0].action} le : ${formatDateHistory(
                  report.history[0].date
                )} \n par ${report.history[0].handler}`}
              </Text>
            )}

            {/* ----------- BLOC AGENT (AJOUT) ----------- */}
            {agent === 'agent' && (
              <View className='mt-2 w-full gap-5'>
                <TouchableOpacity
                  className='border border-gray rounded-2xl h-12 w-full flex-row items-center justify-between px-4'
                  onPress={toggleStatut}
                >
                  <Text>Statut</Text>
                  <Ionicons name='chevron-down-outline' color='#000000' size={20} />
                </TouchableOpacity>

                {statutOpen && (
                  <View className='border border-gray rounded-2xl w-full overflow-hidden'>
                    <TouchableOpacity
                      className={
                        cours
                          ? 'h-12 w-full justify-center items-center bg-deepSage'
                          : 'h-12 w-full justify-center items-center'
                      }
                      onPress={handleCours}
                    >
                      <Text className={cours ? 'text-white' : 'text-black'}>En cours</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className={
                        cloturer
                          ? 'border-gray border-t-[1px] h-12 w-full justify-center items-center bg-deepSage'
                          : 'border-gray border-t-[1px] h-12 w-full justify-center items-center'
                      }
                      onPress={handleCloturer}
                    >
                      <Text className={cloturer ? 'text-white' : 'text-black'}>Clôturer</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TextInput
                  className='border border-gray rounded-2xl h-[150px] w-full px-4'
                  placeholder='Ajouter une description'
                  onChangeText={onChangeDescription}
                  value={description}
                  multiline
                  textAlignVertical='top'
                />

                <TouchableOpacity
                  className='border border-gray bg-deepSage rounded-2xl h-12 w-full justify-center items-center px-4'
                  onPress={() => onActualiser?.({ description, cours, cloturer })}
                >
                  <Text className='text-white'>Actualiser</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <Text>Aucun détail disponible.</Text>
        )
      }
    />
  );
}
