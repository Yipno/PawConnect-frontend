import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import AppText from './AppText';

export default function Input({
  label,
  placeholder,
  type = 'text',
  icon,
  onChangeText,
  value,
  error,
  autoCorrect,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(type === 'password');
  const [isFocused, setIsFocused] = useState(false);
  // set the keyboard for the type of input
  const keyboardType =
    type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default';
  const secureTextEntry = isVisible;
  const iconName = icon && icon + '-outline';

  return (
    <View className={`w-10/12 ${error ? 'mb-1' : 'mb-2'}`}>
      <AppText className='font-manrope left-3 text-text'>{label || 'Label'}</AppText>
      <View
        className={`w-full h-[54px] px-3 flex-row justify-between items-center border-[1px] rounded-xl ${
          error ? 'border-error' : isFocused ? 'border-softOrange border-[2px]' : 'border-deepSage'
        }`}>
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
          autoCapitalize={type === 'text' ? 'sentences' : 'none'}
          className={`h-full flex-1 text-body font-manrope`}
          onChangeText={onChangeText}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCorrect={autoCorrect || false}
          {...props}
        />
        {type === 'password' && (
          <Pressable className='ml-3' onPress={() => setIsVisible(!isVisible)}>
            <Ionicons
              name={isVisible ? 'eye-off-outline' : 'eye-outline'}
              size={26}
              color='#9b9b9b'
            />
          </Pressable>
        )}
      </View>
      {error && (
        <AppText className='left-1 text-small font-manrope-bold text-error'>{error}</AppText>
      )}
    </View>
  );
}
