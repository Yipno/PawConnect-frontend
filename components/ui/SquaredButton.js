import { View, Pressable } from 'react-native';
import React from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import useTheme from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';

export default function SquaredButton({ title, onPress, icon, style }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const iconName = icon && icon + '-outline';
  const defaultStyle = { height: 140 };

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.9);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
      style={{
        shadowOffset: { width: 2, height: 3 },
        shadowColor: 'grey',
        shadowOpacity: 0.4,
      }}
      className='w-[40%] h-auto my-3'
    >
      <Animated.View
        className={`w-full py-8 rounded-2xl justify-center items-center bg-deepSage`}
        style={[animatedStyle, defaultStyle, style]}
      >
        <Ionicons name={iconName || 'person-outline'} size={54} color={colors.offwhite} />
        <AppText className='font-manrope-bold text-h4 text-offwhite text-center mt-1'>
          {title || 'Profile'}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}
