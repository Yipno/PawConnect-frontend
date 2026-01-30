import { Text } from 'react-native';

export default function AppText({ className, bold, ...props }) {
  const hasManrope =
    typeof className === 'string' &&
    (className.includes('font-manrope-bold') || className.includes('font-manrope'));
  const fontClass =
    hasManrope ? ''
    : bold ? 'font-manrope-bold'
    : 'font-manrope';
  const mergedClassName = [fontClass, className].filter(Boolean).join(' ');

  return <Text className={mergedClassName} {...props} />;
}
