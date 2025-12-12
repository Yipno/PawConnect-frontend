import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import CustomModal from '../ui/CustomModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

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
          <View>
            <View className='w-full aspect-[4/3] mb-4'>
              <Image
                source={{ uri: report.photoUrl }}
                className='w-full h-full rounded-2xl object-cover'
              />
            </View>

            {/* Title */}
            <Text className='text-xl font-bold mb-2 text-left'>{report.title}</Text>

            {/* Place & Date */}
            <View className='w-full flex-row justify-between mb-3'>
              <Text>{report.place}</Text>
              <Text>{report.date}</Text>
            </View>

            {/* Priority */}
            <View className='bg-deepSage/20 border border-deepSage rounded-2xl px-3 py-1 self-start mb-4'>
              <Text>{report.priority}</Text>
            </View>

            {/* Description */}
            <View>
              <Text className='text-base text-gray-800 leading-5' style={{ textAlign: 'justify' }}>
                {report.desc}
              </Text>
            </View>
            {agent === 'agent' && (
              <View>
                <View className='flex-col justify-center items-center gap-12 mt-2 w-full'>
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
                    className='border border-gray rounded-2xl h-[150] w-full  justify-between px-4'
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
        ) : (
          <Text>Aucun détail disponible.</Text>
        )
      }
    />
  );
}
