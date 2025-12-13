import React from 'react';
import { Modal, View, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomModal({
  visible,
  onClose,
  content,
  fullscreen = false,
  animationType = 'slide',
}) {
  const insets = useSafeAreaInsets();
  const HEADER_HEIGHT = 56;
  const headerTotalHeight = insets.top + HEADER_HEIGHT;

  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={!fullscreen}
      onRequestClose={onClose}
      statusBarTranslucent={false}
    >
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {/* HEADER (prend en compte l'encoche) */}
        <View
          style={{
            height: headerTotalHeight,
            paddingTop: insets.top,
            borderBottomWidth: 1,
            borderColor: '#e5e7eb',
            justifyContent: 'center',
          }}
        >
          {/* Croix à droite, centrée verticalement dans le header */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              position: 'absolute',
              right: 16,
              top: insets.top + (HEADER_HEIGHT - 28) / 2, // 28 = taille icon
              zIndex: 10,
            }}
          >
            <Ionicons name='close' size={28} color='black' />
          </TouchableOpacity>
        </View>

        {/* CONTENU SCROLLABLE (commence après le header) */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: insets.bottom + 24,
          }}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      </View>
    </Modal>
  );
}
