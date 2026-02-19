import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';
import AppText from '../shared/AppText';
import { ANIMAL_TYPE } from '../../constants/animals';

function AnimalTypeSelector({ animalType, setAnimalType }) {
  const { colors } = useTheme();

  return (
    <View className='w-10/12 h-auto mb-4'>
      <AppText className='text-text mx-2'>Type d'animal</AppText>
      <View className='border-[1px] border-deepSage p-3 rounded-xl flex-row justify-evenly w-auto'>
        {ANIMAL_TYPE.map(type => (
          <TouchableOpacity
            key={type.key}
            className='flex-row items-center'
            onPress={() => setAnimalType(type.key)}>
            <Ionicons
              name={
                animalType === type.key ? 'radio-button-on-outline' : 'radio-button-off-outline'
              }
              size={32}
              color={animalType === type.key ? colors.softOrange : 'lightgray'}
            />
            <AppText
              className={`ml-1 text-center text-body ${animalType === type.key ? 'font-bold' : ''}`}>
              {type.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default AnimalTypeSelector;
