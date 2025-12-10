import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Input({ label, placeholder, type = 'text', icon, onChangeText, value,
 }) {
  // set the keyboard for the type of input
  const keyboardType =
    type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default';
  const secureTextEntry = type === 'password';
  const iconName = icon && icon + '-outline';

  return (
    <View className='w-10/12 mb-2'>
      <Text className='font-manrope left-3 text-text'>{label || 'Label'}</Text>
      <View className='w-full h-14'>
        <Ionicons
          className='absolute top-[10px] left-[6px]'
          name={iconName || 'person-circle-outline'}
          size={26}
          color={'#9b9b9b'}
        />
        <TextInput
          placeholder={placeholder || 'Placeholder'}
          placeholderTextColor='#9b9b9b'
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          className='h-full pl-10 border-[1px] rounded-xl border-deepSage font-manrope focus:border-2 focus:border-softOrange'
          onChangeText={onChangeText}
          value={value}
        />
      </View>
    </View>
  );
}
