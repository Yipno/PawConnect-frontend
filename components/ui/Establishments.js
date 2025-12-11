import { View, Text, Image, TouchableOpacity, Button, Input } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import useTheme from '../../hooks/useTheme';
import { getEstablisments } from '../../reducers/establishments';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// DONNES TEST
const estaData = [
  {
    admin: {
      $oid: '6937b11c152c36d4161d3f5b',
    },
    name: 'SPA Marseille Provence',
    address: {
      street: 'Montée du commandant de Robien',
      city: 'Marseille',
      zipCode: 13011,
    },
    location: {
      lat: 43.29032974403842,
      long: 5.486615267806855,
    },
    phone: 491456351,
    email: 'marseille@spa.fr',
    logo: 'https://www.la-spa.fr/app/app/uploads/2021/09/MicrosoftTeams-image-63.png',
    url: 'https://www.spa-marseille.com/',
    agents: [{ $oid: '6936b3dadca42d8797261664' }],
  },
  {
    admin: {
      $oid: '6936b3dadca42d8797261664',
    },
    name: 'Les chats du coeur',
    address: {
      street: '1855 Rte de Gémenos',
      city: 'Aubagne',
      zipCode: 13400,
    },
    location: {
      lat: 43.29032974403842,
      long: 5.486615267806855,
    },
    phone: 686973184,
    email: 'chatsducoeur@gmail.com',
    logo: 'https://chatsducoeurenclunisois.fr/wp-content/uploads/2017/11/CdC-Logo-S-768x660.jpg',
    url: 'https://www.secondechance.org/refuge/bouches-du-rhone/des-grosses-patounes-2493',
    agents: [{ $oid: '693800654129227720eab358' }],
  },
];

export default function Establishments({name, url, logo, address, street, zipCode, city}) {
  const { colors } = useTheme();

  const dispatch = useDispatch();
  const establishments = useSelector((state) => state.establishments.value);

  // DONNEES TEST REDUCER ETABLISSEMENTS
  const handleData = () => {
    const newEstablishments = [
      {
        admin: {
          $oid: '6937b11c152c36d4161d3f5b',
        },
        name: 'SPA Marseille Provence',
        address: {
          street: 'Montée du commandant de Robien',
          city: 'Marseille',
          zipCode: 13011,
        },
        location: {
          lat: 43.29032974403842,
          long: 5.486615267806855,
        },
        phone: 491456351,
        email: 'marseille@spa.fr',
        logo: 'https://www.la-spa.fr/app/app/uploads/2021/09/MicrosoftTeams-image-63.png',
        url: 'https://www.spa-marseille.com/',
        agents: [{ $oid: '6936b3dadca42d8797261664' }],
      },
      {
        admin: {
          $oid: '6936b3dadca42d8797261664',
        },
        name: 'Les chats du coeur',
        address: {
          street: '1855 Rte de Gémenos',
          city: 'Aubagne',
          zipCode: 13400,
        },
        location: {
          lat: 43.29032974403842,
          long: 5.486615267806855,
        },
        phone: 686973184,
        email: 'chatsducoeur@gmail.com',
        logo: 'https://chatsducoeurenclunisois.fr/wp-content/uploads/2017/11/CdC-Logo-S-768x660.jpg',
        url: 'https://www.secondechance.org/refuge/bouches-du-rhone/des-grosses-patounes-2493',
        agents: [{ $oid: '693800654129227720eab358' }],
      },
    ];
    dispatch(getEstablisments(newEstablishments));
    // console.log('reducers', animals);
    if (establishments.length > 0) {
      // console.log('reducers: ', establishments);
      console.log('esta name: ', establishments[0].name);
      console.log('esta logo: ', establishments[0].logo);
      console.log('esta url: ', establishments[0].url);
      console.log('esta email: ', establishments[0].email);
      console.log('esta adresse: ', establishments[0].address);
    }
  };

  return (
    <SafeAreaView className='flex-1 justify-between items-center bg-offwhite'>
      <Text className='text-h1 font-manrope text-center text-deepSage mt-4'>Organisation</Text>
      <View className='h-full w-11/12 justify-around items-center mb-52 mt-6' >
        <View className='w-full rounded-2xl mb-2 object-cover flex-row'>
          <Image
            source={logo ? {uri: logo} : require('../../assets/placeholder.jpg')}
            alt={'organisation'}
            className='w-28 h-28 rounded-full object-cover'
            width={10}
            height={10}
          />
          <View className='ml-6 justify-center'>
            <Text className='text-h2'>{name || 'Name'}</Text>
            <Text className='underline'>{url || 'www.domaine.com'}</Text>
          </View>
        </View>
        <View className='w-full object-cover flex-row'>
          <Ionicons name='navigate-circle-outline' size={44} color='black' />

          <View className='ml-6'>
            <Text className='text-h4'>Adresse</Text>
            <Text>{`${address?.street || 'Street'}`}</Text>
            <Text>{`${address?.zipCode || ''} ${address?.city || ''}`}zipCode City</Text>
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
            <Text numberOfLines={5} ellipsizeMode='tail' className='text-body text-justify'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</Text>
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
        <Button
          width={320}
          bg={colors.softOrange}
          textColor={colors.offwhite}
          title='Données établissements reducers'
          onPress={handleData}
        />
        <View className='border-[1px] border-deepSage w-3/4'></View>
      </View>
    </SafeAreaView>
  );
}
