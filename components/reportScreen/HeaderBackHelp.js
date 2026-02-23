import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../shared/AppText';
import useTheme from '../../hooks/useTheme';

function HeaderBackHelp({ onPressInfo, onPressBack }) {
  const { colors } = useTheme();

  return (
    <View className='w-full mt-2 px-2 flex-row items-center justify-between'>
      <TouchableOpacity className='flex-row items-center' onPress={onPressBack}>
        <Ionicons name='caret-back-outline' size={24} color={colors.textColor} />
        <AppText className='text-body font-manrope'>Retour</AppText>
      </TouchableOpacity>
      <TouchableOpacity className='flex-row items-center' onPress={onPressInfo}>
        <AppText className='text-body font-manrope'>Aide</AppText>
        <Ionicons name='help-circle-outline' size={26} color={colors.textColor} />
      </TouchableOpacity>
    </View>
  );
}

export default HeaderBackHelp;
