import React from 'react';
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import useTheme from '../../hooks/useTheme';

export default function EstablishmentsModalContent() {
  const { colors } = useTheme();

  const establishments = useSelector(state => state.establishments.value);
  const user = useSelector(state => state.user.value);

  const establishmentsToDisplay = (() => {
    if (user.role === 'agent') {
      if (!user.establishment) {
        return []; // agent sans association
      }

      return establishments.filter(e => e._id === user.establishment);
    }

    // civil
    return establishments;
  })();

  return (
    <ScrollView
      style={{ flex: 1, width: '100%' }}
      contentContainerStyle={{
        width: '100%',
        alignItems: 'center', // Permet à la ScrollView de prendre tout l'espace
      }}
      keyboardShouldPersistTaps='handled'>
      <View className='w-10/12'>
        <Text className='text-h2 text-center font-manrope-bold text-deepSage mb-4'>
          {user.role === 'agent' ? 'Mon organisation' : 'Associations'}
        </Text>

        {user.role === 'agent' && establishmentsToDisplay.length === 0 && (
          <View className='mt-6 p-4 bg-red-100 rounded'>
            <Text className='text-center text-red-700 font-bold'>
              Aucune association répertoriée
            </Text>
            <Text className='text-center text-red-700 mt-1'>
              Veuillez contacter l'administrateur.
            </Text>
          </View>
        )}

        {establishmentsToDisplay.map(establishment => (
          <View
            key={establishment._id}
            className='flex-row bg-gray-100 border-b-[1px] border-neutral-300 w-full'>
            {/* Logo */}
            {establishment.logo && (
              <Image
                source={{ uri: establishment.logo }}
                className='w-20 h-20 my-1 rounded'
                resizeMode='contain'
              />
            )}
            <View className='ml-4 mt-1 mb-2 flex-1'>
              {/* Nom */}
              <Text className='font-manrope-bold text-lg'>{establishment.name}</Text>

              {/* Adresse */}
              {establishment.address && (
                <Text className='font-manrope text-sm'>
                  {establishment.address.street}, {'\n'}
                  {establishment.address.zipCode} {establishment.address.city}
                </Text>
              )}

              {/* Téléphone */}
              <TouchableOpacity>
                <Text className='font-manrope text-small mt-1'>{establishment.phone}</Text>
              </TouchableOpacity>

              {/* Email */}
              <TouchableOpacity onPress={() => Linking.openURL(`mailto:${establishment.email}`)}>
                <Text className='font-manrope text-small text-semibold text-deepSage'>
                  {establishment.email}
                </Text>
              </TouchableOpacity>

              {/* Site web */}
              {establishment.url && (
                <TouchableOpacity onPress={() => Linking.openURL(establishment.url)}>
                  <Text className='text-lg font-bold text-deepSage'>Visiter le site</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
