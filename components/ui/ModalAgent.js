import React from 'react';
import { Modal, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

export default function CustomModal({ visible, onClose, title, content }) {
  return (
    <Modal
      visible={visible}
      animationType='slide'
      presentationStyle='fullScreen'
      statusBarTranslucent
    >
      <SafeAreaView className='flex-1 bg-offwhite'>
        {/* HEADER */}
        <View className='h-14 flex-row items-center justify-center relative border-b border-gray'>
          {/* Bouton fermer */}
          <TouchableOpacity onPress={onClose} className='absolute right-4' hitSlop={10}>
            <Ionicons name='close' size={26} color='#000' />
          </TouchableOpacity>

          {/* Titre */}
          <AppText className='text-lg font-semibold text-black'>{title}</AppText>
        </View>

        {/* CONTENU */}
        <ScrollView className='flex-1 px-4 py-4' showsVerticalScrollIndicator={false}>
          {content}
          <View className='h-12' />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
