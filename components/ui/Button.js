import { Pressable } from 'react-native';
import useTheme from '../../hooks/useTheme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import AppText from './AppText';

export default function Button({ title, bg, onPress, textColor, width, border, margin }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const borders = border ? ['border-[3px]', `border-${border}`] : [];
  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.9);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
      className={`${width ? width : 'w-10/12'}`}
      style={{
        shadowOffset: { width: 2, height: 3 },
        shadowColor: 'grey',
        shadowOpacity: 0.4,
      }}>
      <Animated.View
        className={`h-16 w-full my-2 rounded-full justify-center items-center bg-deepSage text-deepSage ${borders.join(
          ' ',
        )}`}
        style={[{ backgroundColor: bg || colors.deepSage }, animatedStyle, margin]}>
        <AppText
          style={{ color: textColor || colors.offwhite, flexShrink: 1, maxWidth: '100%' }}
          className='font-manrope-bold text-3xl mt-0.5'>
          {title}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}
