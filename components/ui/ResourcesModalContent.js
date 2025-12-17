// components/ui/ResourcesModalContent.js
import React from 'react';
import {
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../../hooks/useTheme';

export default function ResourcesModalContent() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.offwhite }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 50,
            alignItems: 'center',
          }}
          keyboardShouldPersistTaps='handled'
        >
          <View className='w-full px-6 py-4'>
            <Text className='text-h2 text-center font-manrope font-bold text-deepSage mb-4'>
              Ressources utiles
            </Text>
            <TouchableOpacity
              className='bg-gray-100 p-4  mb-3'
              onPress={() => Linking.openURL('https://www.la-spa.fr/')}
            >
              <Text className=' font-bold'>SPA France</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className='bg-gray-100 p-4 '
              onPress={() => Linking.openURL('https://www.30millionsdamis.fr/')}
            >
              <Text className=' font-bold'>30 Millions d'Amis</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
