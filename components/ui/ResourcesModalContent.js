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
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';

export default function ResourcesModalContent() {
  const { colors } = useTheme();

  const resources = [
    { name: 'SPA France', url: 'https://www.la-spa.fr/' },
    { name: "30 Millions d'Amis", url: 'https://www.30millionsdamis.fr/' },
    { name: 'WWF France', url: 'https://www.wwf.fr/' },
    { name: 'One Voice', url: 'https://www.one-voice.fr/' },
  ];

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
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full px-6 py-4">
            <Text className="text-h2 text-center font-manrope-bold text-deepSage mb-4">
              Ressources utiles
            </Text>

            {resources.map((res, i) => (
              <TouchableOpacity
                key={i}
                className="bg-gray-100 p-4 mb-3 flex-row items-center"
                onPress={() => Linking.openURL(res.url)}
              >
                {/* Optionnel: icône lien */}
                <Ionicons
                  name="link-outline"
                  size={20}
                  
                  style={{ marginRight: 8 }}
                />
                <Text className="font-bold text-deepSage underline">
                  {res.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
