import React from 'react';
import { Modal, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';

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

  return (
    <Modal
      accessible
      visible={visible}
      transparent
      animationType={animationType || 'slide'}
      onRequestClose={onClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View
          className={`rounded-2xl items-center ${
            fullscreen ? 'w-full h-full p-6 pt-12' : 'w-11/12 min-h-[300px] p-12'
          }`}
          style={{ backgroundColor: colors.offwhite }}>
          {/* Croix de fermeture */}
          <Ionicons
            name='close'
            size={36}
            color={colors.text}
            onPress={onClose}
            style={{
              position: 'absolute',
              top: fullscreen ? 54 : 16,
              right: 16,
            }}
          />

          {/* Titre */}
          {title && (
            <Text className='text-xl font-bold mb-4 text-center' style={{ color: colors.text }}>
              {title}
            </Text>
          )}

          {/* Contenu (supporte soit `content` prop soit `children`) */}
          <View className='mb-4'>
            {content || children || (
              <Text className='text-center' style={{ color: colors.text }}>
                {content}
              </Text>
            )}
          </View>
          {/* Boutons (optionnels) */}
          {button && (
            <View className='flex-row justify-center items-center mt-4 space-x-4'>{button}</View>
          )}
        </View>
      </View>
    </Modal>
  );
}
