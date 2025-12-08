import { View, Text, Alert } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user';
import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

export default function SignInScreen() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = async () => {
    // check if fields are filled
    if (!email || !password) {
      Alert.alert('Veuillez remplir tous les champs.');
      return;
    }
    //check if email is valid
    if (!EMAIL_REGEX.test(email)) {
      Alert.alert('Email invalide.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Votre mot de passe doit contenir au moins 6 caractères.');
    }
    // post user info for login
    try {
      const result = await fetch(`${BACKEND}/users/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await result.json();
      // send data to redux
      if (data.result) {
        dispatch(login(data.user));
        setEmail('');
        setPassword('');
      } else {
        Alert.alert(data.error);
      }
    } catch (err) {
      Alert.alert(err);
    }
  };

  return (
    <SafeAreaView className='flex-1 justify-evenly items-center bg-offwhite'>
      <Text className='text-h2 text-darkSage'>Se connecter</Text>
      <View className='w-full h-1/3 justify-center items-center'>
        <Input
          label='Email'
          type='email'
          icon='mail'
          placeholder='example@pawconnect.xyz'
          onChangeText={value => setEmail(value)}
          value={email}
        />
        <Input
          label='Password'
          type='password'
          icon='key'
          placeholder='••••••••'
          onChangeText={value => setPassword(value)}
          value={password}
        />
      </View>
      <Button title='Connexion' onPress={handleLogIn} />
    </SafeAreaView>
  );
}
