import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAnimatedStyle, useSharedValue, withSpring, interpolate } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import { useEffect } from 'react';

export default function TabBarButton({ icon, onPress, isFocused, color, label }) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused, {
      duration: 350,
    });
  }, [isFocused]);

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);
    return { opacity };
  });

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return {
      transform: [
        {
          scale: scaleValue,
        },
      ],
      top,
    };
  });

  return (
    <Pressable onPress={onPress} style={styles.tabButton}>
      <Animated.View style={animatedIconStyle}>
        <Ionicons name={icon} size={32} color={color} />
      </Animated.View>
      <Animated.Text style={[styles.label, animatedTextStyle]}>{label}</Animated.Text>
    </Pressable>
  );
}
//isFocused && { backgroundColor: '#7f9C88'
export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#faf9f7',
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderRadius: 35,
    // borderBottomRightRadius: 35,
    // borderBottomLeftRadius: 35,
    elevation: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    flex: 1,
    height: '90%',
    borderRadius: 28,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2E2F2F',
    marginTop: 4,
  },
});
