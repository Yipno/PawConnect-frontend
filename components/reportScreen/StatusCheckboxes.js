import { View } from 'react-native';
import { AdvancedCheckbox } from 'react-native-advanced-checkbox';
import AppText from '../shared/AppText';
import useTheme from '../../hooks/useTheme';
import { ANIMAL_STATE } from '../../constants/animals';

function StatusCheckboxes({ animalState, onToggle }) {
  const { colors } = useTheme();

  return (
    <View className='w-10/12 h-auto mt-2'>
      <AppText className='text-text font-manrope mx-2'>Quel est son état ?</AppText>
      <View className='border-[1px] border-deepSage p-1 rounded-xl flex-row justify-evenly w-auto'>
        <View className='flex-row justify-between w-10/12'>
          <View className='justify-center w-1/2'>
            {ANIMAL_STATE.slice(0, 5).map(status => (
              <AdvancedCheckbox
                key={status.key}
                label={status.label}
                value={animalState.includes(status.key)}
                checkedColor={colors.softOrange}
                onValueChange={isChecked => onToggle(status.key, isChecked)}
                labelStyle={{ fontFamily: 'Manrope' }}
              />
            ))}
          </View>
          <View className='justify-center w-1/2'>
            {ANIMAL_STATE.slice(5).map(status => (
              <AdvancedCheckbox
                key={status.key}
                label={status.label}
                value={animalState.includes(status.key)}
                checkedColor={colors.softOrange}
                onValueChange={isChecked => onToggle(status.key, isChecked)}
                labelStyle={{ fontFamily: 'Manrope' }}
              />
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

export default StatusCheckboxes;
