import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import CustomModal from '../ui/CustomModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Location from 'expo-location';
import { getDistanceLabel } from '../../helpers/getDistance';
import Button from '../ui/Button';
import moment from 'moment'; //module for Format date
import 'moment/locale/fr';
import Establishments from '../ui/Establishments';

moment.locale('fr');

const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

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
  const [showOrgaInfo, setShowOrgaInfo] = useState(false);

  const user = useSelector(state => state.user.value);

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
      setShowOrgaInfo(false);
    }
  }, [visible]);

  // ESTABLISHMENTS DISPLAY

  // ESTABLISHMENTS MODAL DISPLAY ON CONDITION
  const reportHasCurrentHandler = Boolean(report?.currentHandler);
  // console.log('reporthashandler', reportHasCurrentHandler);

  // REPORT ANIMALS/POPULATE/:ID
  const [populatedReport, setPopulatedReport] = useState([]);

  const populatedCurrentReport = populatedReport?.find(r => r._id === report?._id);
  // console.log('populated report', populatedCurrentReport);

  //FETCH GET REPORT INFO
  // //! A ENLEVER CAR FETCH SE FAIT AU SIGNIN ET RECUP INFO DE REDUX
  // useEffect(() => {
  //   if (!visible || !report) return;

  //   fetch(`${BACKEND}/animals/populate/${report.reporter}`, {
  //     headers: {
  //       Authorization: `Bearer ${user.token}`, // token JWT
  //     },
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       // console.log("data fetch", data);
  //       if (data.result) {
  //         setPopulatedReport(data.reports);
  //       } else {
  //         console.log(data.message);
  //       }
  //     });
  // }, [visible, report]);

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      fullscreen
      statut
      agent=''
      content={
        report ? (
          showOrgaInfo ? (
            <>
              <Establishments populatedReport={populatedCurrentReport} />
            </>
          ) : (
            <KeyboardAwareScrollView
              enableOnAndroid
              extraScrollHeight={100}
              keyboardShouldPersistTaps='handled'
              contentContainerStyle={{ paddingBottom: 40 }}
              style={{ flex: 1 }}
              className='w-full px-6 py-4 bg-offwhite'>
              {/* Photo */}
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

              {/* Priority*/}
              <View className='bg-deepSage/20 border border-deepSage rounded-2xl px-3 py-1 self-start mb-4'>
                <Text>{report.priority}</Text>
              </View>

              {/* Tag */}
              <View className='flex-row flex-wrap mb-4'>
                {Array.isArray(report.state) &&
                  report.state.map((tag, index) => (
                    <View
                      key={index}
                      className='bg-softOrange border-[1px] border-orange-500 rounded-2xl mr-2 mb-2 px-3 py-1'>
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

              {/* Display establishments */}
              <View className='mt-4'>
                {reportHasCurrentHandler ? (
                  <View className='mt-3'>
                    <View className='border-[0.5px] black my-2 '></View>
                    <Text>
                      Signalement pris en charge le{' '}
                      {moment(populatedCurrentReport?.history[0]?.date).format('LL')} à{' '}
                      {moment(populatedCurrentReport?.history[0]?.date).format('LT')} par :
                    </Text>
                    <TouchableOpacity
                      className='bg-deepSage w-3/4 justify-between items-center rounded-2xl mr-2 mb-2 px-9 py-4 mt-4'
                      // ouvre la page de l'organisation
                      onPress={() => setShowOrgaInfo(true)}>
                      <Text className='text-white font-extrabold'>
                        {populatedCurrentReport?.establishment?.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text>En attente de prise en charge</Text>
                )}
              </View>

              {agent === 'agent' && (
                <View>
                  <View className='flex-col justify-center items-center gap-2 mt-2 w-full'>
                    <TouchableOpacity
                      className='border border-gray rounded-2xl h-12 w-full flex-row items-center justify-between px-4'
                      onPress={onPress}>
                      <Text className='font-manrope'>
                        {cours ? 'En cours' : cloturer ? 'Clôturer' : 'Changer le statut ?'}
                      </Text>
                      <Ionicons
                        name={statut ? 'chevron-up-outline' : 'chevron-down-outline'}
                        color='#000'
                        size={20}
                      />
                    </TouchableOpacity>
                    {statut && (
                      <View className='absolute top-[42px] z-10 border border-gray rounded-2xl bg-white w-full flex-col justify-center items-center '>
                        <TouchableOpacity
                          className={
                            cours
                              ? 'rounded-t-2xl h-12 w-full flex-col justify-center items-center bg-deepSage'
                              : 'h-12 w-full rounded-t-2xl flex-col justify-center items-center'
                          }
                          onPress={() => {
                            handleCours();
                            onPress();
                          }}>
                          <Text className={cours ? 'text-white' : 'text-black'}>En cours</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className={
                            cloturer
                              ? 'border-gray border-t-[1px] rounded-b-2xl h-12 w-full flex-col justify-center items-center bg-deepSage'
                              : 'border-gray border-t-[1px] h-12 w-full flex-col justify-center items-center'
                          }
                          onPress={() => {
                            handleCloturer();
                            onPress();
                          }}>
                          <Text className={cloturer ? 'text-white' : 'text-black'}>Clôturer</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <TextInput
                      multiline={true}
                      className='border border-gray rounded-2xl h-[150] w-full justify-between px-4 mb-2 focus:border-softOrange focus:border-2'
                      placeholder='Renseignez les actions effectuées...'
                      placeholderTextColor='#9b9b9b'
                      onChangeText={onChangeDescription}
                      value={description}
                    />
                    <Button
                      title='Actualiser'
                      width={'w-full'}
                      onPress={() => onActualiser({ description, cours, cloturer })}
                    />
                  </View>
                </View>
              )}
            </KeyboardAwareScrollView>
          )
        ) : (
          <Text>Aucun détail disponible.</Text>
        )
      }
    />
  );
}
