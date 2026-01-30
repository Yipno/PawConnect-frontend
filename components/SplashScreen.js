import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import Animated from 'react-native-reanimated';
import Button from './ui/Button';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/user';
import useTheme from '../hooks/useTheme';

const rotate = {
  '0%': {
    transform: [{ rotateZ: '0deg' }],
  },
  '100%': {
    transform: [{ rotateZ: '360deg' }],
  },
};

export default function SplashScreen({ text }) {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  return (
    <View className='justify-center items-center bg-offwhite'>
      <Animated.View
        style={{
          animationName: rotate,
          animationDuration: '4s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}>
        <Ionicons name='cog-outline' size={100} color={'#a3a3a3'} />
      </Animated.View>
      <Text className='text-h3 font-manrope-bold text-neutral-400'>
        {text || 'Chargement des données...'}
      </Text>
    </View>
  );
}
