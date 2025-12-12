import React from 'react';
import { Modal, View, Text, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomModal({
  visible,
  onClose,
  title,
  content,
  button,
  fullscreen = false,
  animationType,
}) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const isFull = !!fullscreen;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={animationType || 'slide'}
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View
          className={`rounded-lg justify-center items-center ${
            fullscreen
              ? 'w-full h-full p-6 items-center'
              : 'w-11/12 min-h-[300px] p-12 justify-center items-center'
          }`}
          style={{ backgroundColor: colors.offwhite }}
        >
          {/* Croix de fermeture */}
          <Ionicons
            name='close'
            size={28}
            color={colors.text}
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
            }}
          />

          {/* Titre */}
          {title && (
            <Text className='text-xl font-bold mb-4 text-center' style={{ color: colors.text }}>
              {title}
            </Text>
          )}

          {/* Contenu */}
          <View className='mb-4'>
            {content || (
              <Text className='text-center' style={{ color: colors.text }}>
                Default content
              </Text>
            )}
          </View>

          {/* Content */}
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              paddingBottom: button ? 90 : 24,
            }}
            keyboardShouldPersistTaps='handled'
          >
            {content || (
              <Text style={{ color: colors.text, textAlign: 'center' }}>Default content</Text>
            )}
          </ScrollView>

          {/* Footer buttons */}
          {button && (
            <View className='flex-row justify-center items-center mt-4 space-x-4'>{buttons}</View>
          )}
        </View>

        {!isFull && <Pressable style={{ flex: 1 }} onPress={onClose} />}
      </View>
    </Modal>
  );
}
