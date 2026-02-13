import { View } from 'react-native';
import AppText from '../shared/AppText';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../../hooks/useTheme';

export default function AuthLayout({ title, children }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.offwhite }}>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: colors.offwhite }}>
        <View className='flex-1 justify-between items-center bg-offwhite'>
          <AppText className='text-h2 text-deepSage mt-4 font-manrope-bold'>{title}</AppText>

          <View className='flex-1 w-full justify-center items-center pb-20'>{children}</View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
