import { View, Text, Image, TouchableOpacity, Button, Input, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export default function Establishments({ populatedReport }) {
  return (
    <SafeAreaView className='flex-1 items-center bg-offwhite'>
      <Text className='text-h2 text-deepSage font-manrope-bold text-center'>Organisation</Text>
      <View className='h-2/3 w-11/12 justify-start items-center mt-2'>
        <View className='w-full rounded-2xl mb-2 object-cover flex-row'>
          <Image
            source={
              populatedReport?.establishment?.logo
                ? { uri: populatedReport?.establishment?.logo }
                : require('../../assets/placeholder.jpg')
            }
            alt={'organisation'}
            className='w-24 h-24 rounded-full'
            width={10}
            height={10}
          />
          <View className='ml-4 justify-center'>
            <Text className='text-h3 font-manrope-bold'>{populatedReport?.establishment.name || 'Name'}</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL(`${populatedReport?.establishment.url}`)}>
              <Text numberOfLines={4} ellipsizeMode='tail' className='underline'>
                {populatedReport?.establishment.url || 'www.domaine.com'}
              </Text>
            </TouchableOpacity>
            <Text className=''>
              {`0${populatedReport?.establishment.phone}` || '01 23 45 67 89'}
            </Text>
          </View>
        </View>
        <View className='w-full object-cover flex-row my-4'>
          <Ionicons name='navigate-circle-outline' size={44} color='black' />

          <View className='ml-6'>
            <Text className='text-h4 font-manrope-bold'>Adresse</Text>
            <Text>{`${populatedReport?.establishment.address.street || 'Street'}`}</Text>
            <Text>{`${populatedReport?.establishment.address.zipCode || ''} ${
              populatedReport?.establishment.address.city || 'zipCode City'
            }`}</Text>
          </View>
        </View>
        <View className='w-full object-cover flex-row my-4'>
          <Ionicons name='time-outline' size={44} color='black' />
          <View className='ml-6'>
            <Text className='text-h4 font-manrope-bold'>Horaires</Text>
            <Text>L-V: 9h-12h 13h-18h</Text>
            <Text>S: 9-18h</Text>
          </View>
        </View>
        <View className='border-b-2 border-deepSage w-3/4 my-4'></View>
        <View className='w-full'>
          <Text
            numberOfLines={8}
            ellipsizeMode='tail'
            className='font-manrope text-body text-justify mx-2 mt-4 mb-8'>
            A'V Refuge est une association créée en vertu de la loi de 1901. Elle est située à La
            Réunion et sa mission est de protéger et de venir en aide à la nature dans son ensemble
            sur ce territoire. Fondée par des amoureux des animaux, l'association est gérée par une
            équipe de personnes passionnées et dévouées qui travaillent tous les jours pour offrir
            aux animaux et aux plantes du refuge tous les soins et l'attention dont ils ont besoin.
          </Text>

          <Image
            source={require('../../assets/accueil_spa_de_la_reunion.png')}
            alt={'organisation'}
            className='w-full h-44 rounded-2xl object-cover'
            width={10}
            height={10}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
