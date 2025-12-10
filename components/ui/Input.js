import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function Input({
  label,
  placeholder,
  type = 'text',
  icon,
  onChangeText,
  value,
  error,
}) {
  const [isVisible, setIsVisible] = useState(type === 'password');
  const [isFocused, setIsFocused] = useState(false);
  // set the keyboard for the type of input
  const keyboardType =
    type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default';
  const secureTextEntry = isVisible;
  const iconName = icon && icon + '-outline';

  return (
    <View className={`w-10/12 ${error ? 'mb-6' : 'mb-2'}`}>
      <Text className='font-manrope left-3 text-text'>{label || 'Label'}</Text>
      <View
        className={`w-full h-[54px] px-3 flex-row justify-between items-center border-[1px] rounded-xl ${
<<<<<<< HEAD
          isFocused ? 'border-softOrange border-2' : 'border-deepSage'
        } ${error ? 'border-red-600' : 'border-deepSage'}`}
      >
=======
          isFocused ? 'border-softOrange border-[2px]' : 'border-deepSage'
        } ${error ? 'border-red-600' : 'border-deepSage'}`}>
>>>>>>> b487ca356ddcb9db19575258ae1a950a4ff7edfd
        <Ionicons
          className='mr-3'
          name={iconName || 'person-circle-outline'}
          size={26}
          color='#9b9b9b'
        />
        <TextInput
          placeholder={placeholder || 'Placeholder'}
          placeholderTextColor='#9b9b9b'
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize={type === 'text' ? 'words' : 'none'}
          className={`h-full flex-1 text-body font-manrope`}
          onChangeText={onChangeText}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {type === 'password' && (
          <Pressable className='ml-3' onPress={() => setIsVisible(!isVisible)}>
            <Ionicons
              name={isVisible ? 'eye-off-outline' : 'eye-outline'}
              size={26}
              className=''
              color='#9b9b9b'
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text className='left-1 text-small font-semibold font-manrope text-red-600'>{error}</Text>
      )}
    </View>
  );
}
