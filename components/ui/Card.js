import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');

export default function Card({ title, desc, date, place, priority, photoUrl, onPress }) {
  const priorityValues = {
    urgent: { label: 'Urgent', color: ['border-red-600', 'bg-red-200'] },
    important: { label: 'Important', color: ['border-orange-400', 'bg-orange-200'] },
    modere: { label: 'Modéré', color: ['border-blue-500', 'bg-blue-200'] },
    faible: { label: 'Faible', color: ['border-green-500', 'bg-green-200'] },
  };

  const priorityColor = priorityValues[priority]?.color || ['border-gray-400', 'bg-gray-200'];

  return (
    <TouchableOpacity onPress={onPress}>
      <View
        className='bg-offwhite border-[1px] border-deepSage rounded-3xl w-11/12 h-52 mx-auto my-2 p-3 flex-row'
        style={{
          shadowOffset: { width: 2, height: 2 },
          shadowColor: 'grey',
          shadowOpacity: 0.3,
        }}>
        <View className='w-2/5'>
          <Image
            source={photoUrl ? { uri: photoUrl } : require('../../assets/placeholder.jpg')}
            alt={'animal'}
            className='w-full h-4/5 rounded-2xl mb-2 object-cover'
            width={10}
            height={10}
          />
          <View
            className={`h-1/6 border-[1px] rounded-2xl items-center justify-center ${priorityColor.join(
              ' '
            )}`}>
            <Text>{priorityValues[priority]?.label || 'Priority'}</Text>
          </View>
        </View>
        <View className='w-3/5'>
          <View className=' h-4/5 overflow-hidden'>
            <Text
              numberOfLines={1}
              className='text-h4 my-0 mx-2 text-text font-manrope leading-tight'>
              {title || 'Title Card'}
            </Text>
            <Text numberOfLines={6} ellipsizeMode='tail' className='text-small text-text mx-2 mt-1'>
              {desc ||
                'Ex qui do nisi aliqua deserunt sunt proident id ea id aliquip incididunt consectetur. Ex qui do nisi aliqua deserunt sunt proident id ea id aliquip incididunt consectetur.'}
            </Text>
          </View>
          <View className='h-1/5 flex-row justify-between items-center mx-2 mt-1'>
            <View className='flex-row items-center'>
              <Ionicons name='location-outline' size={14} className='mr-1' />
              <Text className='text-small text-text font-manrope '>{place || '2 km'}</Text>
            </View>
            <View className='flex-row items-center'>
              <Ionicons name='time-outline' size={14} className='mr-1' />
              <Text className='text-small text-text font-manrope'>
                {moment(date).fromNow() || ''}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
