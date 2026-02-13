import React from 'react';
import { Modal, View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from './AppText';

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
      onRequestClose={onClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View
          className={` items-center relative ${
            fullscreen
              ? 'w-full h-full pt-24'
              : 'rounded-2xl mt-64 w-11/12 min-h-[300px] max-h-[600px] p-10'
          }`}
          style={{ backgroundColor: colors.offwhite }}>
          {/* Croix de fermeture */}
          <Ionicons
            name='close'
            size={34}
            color={colors.text}
            onPress={onClose}
            style={{
              position: 'absolute',
              top: fullscreen ? 56 : 16,
              right: 16,
              zIndex: 20,
            }}
          />

          {/* Titre */}
          {title && (
            <AppText
              className='text-xl font-bold mt-6 mb-4 text-center'
              style={{ color: colors.text }}>
              {title}
            </AppText>
          )}

          {/* Contenu */}
          <View className='flex-1 w-full mb-4'>
            {content || (
              <AppText className='text-center' style={{ color: colors.text }}>
                Default content
              </AppText>
            )}
          </View>

          {/*!!! COMMENTÉ CAR DOUBLON AVEC LE CODE AU DESSUS */}
          {/* Content
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              paddingBottom: button ? 90 : 24,
            }}
            keyboardShouldPersistTaps='handled'>
            {content || (
              <AppText style={{ color: colors.text, textAlign: 'center' }}>Default content</AppText>
            )}
          </ScrollView> */}

          {/* Footer buttons */}
          {button && <View className='w-full justify-center items-center mt-4'>{button}</View>}
        </View>

        {!isFull && <Pressable style={{ flex: 1 }} onPress={onClose} />}
      </View>
    </Modal>
  );
}
