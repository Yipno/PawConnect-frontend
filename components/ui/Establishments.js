import { View, Text, Image, TouchableOpacity, Button, Input } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

export default function Establishments({ populatedReport }) {
  return (
    <SafeAreaView className='flex-1 justify-between items-center bg-offwhite'>
      <Text className='text-h1 font-manrope text-center'>Organisation</Text>
      <View className='h-full w-11/12 justify-around items-center mb-52 mt-2'>
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
            <Text className='text-h3'>{populatedReport?.establishment.name || 'Name'}</Text>
            <Text numberOfLines={4} ellipsizeMode='tail' className='underline'>
              {populatedReport?.establishment.url || 'www.domaine.com'}
            </Text>
            <Text className=''>
              {`0${populatedReport?.establishment.phone}` || '01 23 45 67 89'}
            </Text>
          </View>
        </View>
        <View className='w-full object-cover flex-row'>
          <Ionicons name='navigate-circle-outline' size={44} color='black' />

          <View className='ml-6'>
            <Text className='text-h4'>Adresse</Text>
            <Text>{`${populatedReport?.establishment.address.street || 'Street'}`}</Text>
            <Text>{`${populatedReport?.establishment.address.zipCode || ''} ${
              populatedReport.establishment.address.city || 'zipCode City'
            }`}</Text>
          </View>
        </View>
        <View className='w-full object-cover flex-row'>
          <Ionicons name='time-outline' size={44} color='black' />
          <View className='ml-6'>
            <Text className='text-h4'>Horaires</Text>
            <Text>L-V: 9h-12h 13h-18h</Text>
            <Text>S: 9-18h</Text>
          </View>
        </View>
        <View className='w-full'>
          <Text numberOfLines={5} ellipsizeMode='tail' className='text-body text-justify'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris...
          </Text>
        </View>
        <View className='w-full  object-cover flex-row'>
          <Image
            source={require('../../assets/placeholder.jpg')}
            alt={'organisation'}
            className='w-full h-44 rounded-2xl object-cover'
            width={10}
            height={10}
          />
        </View>
        <View className='border-[1px] border-deepSage w-3/4'></View>
      </View>
    </SafeAreaView>
  );
}
