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
      presentationStyle='overFullScreen'
    >
      {/* Overlay */}
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        {/* Click outside to close (optionnel) */}
        {!isFull && <Pressable style={{ flex: 1 }} onPress={onClose} />}

        {/* Sheet / Fullscreen container */}
        <View
          style={{
            flex: isFull ? 1 : 0,
            alignSelf: isFull ? 'stretch' : 'center',
            width: isFull ? '100%' : '91.666%',
            maxHeight: isFull ? '100%' : '80%',
            backgroundColor: colors.offwhite,
            borderRadius: isFull ? 0 : 12,
            overflow: 'hidden',
            paddingTop: isFull ? insets.top : 0,
            paddingBottom: isFull ? insets.bottom : 0,
          }}
        >
          {/* Header */}
          <View
            style={{
              height: 56,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(0,0,0,0.08)',
            }}
          >
            <View style={{ width: 28 }} />
            <View style={{ flex: 1, alignItems: 'center' }}>
              {!!title && (
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700' }}>{title}</Text>
              )}
            </View>

            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name='close' size={28} color={colors.text} />
            </Pressable>
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
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: isFull ? insets.bottom : 0,
                padding: 16,
                borderTopWidth: 1,
                borderTopColor: 'rgba(0,0,0,0.08)',
                backgroundColor: colors.offwhite,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>{button}</View>
            </View>
          )}
        </View>

        {!isFull && <Pressable style={{ flex: 1 }} onPress={onClose} />}
      </View>
    </Modal>
  );
}
