import React from 'react';
import {
  Modal,
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';

export default function CustomModal({
  visible,
  onClose,
  title,
  content,
  button,
  children,
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1 justify-center items-center bg-black/50'>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className={`rounded-lg  ${fullscreen ? 'w-full h-full' : 'w-11/12 min-h-[300px] p-12'}`}
            style={{ backgroundColor: colors.offwhite }}>
            {/* Croix de fermeture */}
            <Ionicons
              name='close'
              size={28}
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
                  Default content
                </Text>
              )}
            </View>
            {/* Boutons (optionnels) */}
            {button && (
              <View className='flex-row justify-center items-center mt-4 space-x-4'>{buttons}</View>
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
