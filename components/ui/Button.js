import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import useTheme from '../../hooks/useTheme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function Button({ title, bg, onPress, textColor, width }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.9);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
      style={{ width: width || 360 }}>
      <Animated.View
        className='h-16 rounded-2xl justify-center items-center'
        style={[{ backgroundColor: bg || colors.deepSage }, animatedStyle]}>
        <Text style={[styles.text, { color: textColor || colors.offwhite }]}>{title}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    shadowColor: '#5b5b5b8e',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 20,
    fontWeight: 600,
  },
});
