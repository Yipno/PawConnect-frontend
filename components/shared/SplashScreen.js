import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import AppText from './AppText';

const rotate = {
  '0%': {
    transform: [{ rotateZ: '0deg' }],
  },
  '100%': {
    transform: [{ rotateZ: '360deg' }],
  },
};

export default function SplashScreen({ text }) {
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
      <AppText className='text-h3 font-manrope-bold text-neutral-400'>
        {text || 'Chargement des données...'}
      </AppText>
    </View>
  );
}
