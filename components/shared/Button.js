import { Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import AppText from './AppText';
import useTheme from '../../hooks/useTheme';

const isHex = v => typeof v === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(v);

const resolveColor = (value, colors, fallback) => {
  if (!value) return fallback;
  if (isHex(value)) return value;
  return colors[value] ?? fallback;
};

export default function Button({ title, bg, onPress, textColor, width, border, margin, ...props }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const backgroundColor = resolveColor(bg, colors, colors.deepSage);
  const color = resolveColor(textColor, colors, colors.offwhite);

  const borderColor = border ? resolveColor(border, colors, colors.text) : 'transparent';
  const borderWidth = border ? 3 : 0;

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.9);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
      className={width ?? 'w-10/12'}
      style={{
        shadowOffset: { width: 2, height: 3 },
        shadowColor: 'grey',
        shadowOpacity: 0.4,
      }}
      {...props}>
      <Animated.View
        className='h-16 w-full my-2 rounded-full justify-center items-center'
        style={[animatedStyle, , { backgroundColor, borderColor, borderWidth }, margin]}>
        <AppText
          style={{ flexShrink: 1, maxWidth: '100%', color }}
          className='font-manrope-bold text-3xl mt-0.5'>
          {title}
        </AppText>
      </Animated.View>
    </Pressable>
  );
}
