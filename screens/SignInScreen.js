import { useState } from 'react';
import { View } from 'react-native';
import { useSignIn } from '../hooks/useAuth';
import AppText from '../components/shared/AppText';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import SplashScreen from '../components/shared/SplashScreen';
import AuthLayout from '../components/auth/AuthLayout';
import AuthBannerError from '../components/auth/AuthBannerError';

export default function SignInScreen({ navigation }) {
  const { submit, status, error, fieldErrors, resetError } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogIn = async () => {
    await submit({ email, password });
  };

  return (
    <>
      {status === 'submitting' ?
        <View className='flex-1 justify-center bg-offwhite'>
          <SplashScreen />
        </View>
      : <AuthLayout title='Se connecter'>
          <Input
            label='Email'
            type='email'
            value={email}
            icon='mail'
            placeholder='example@pawconnect.xyz'
            onChangeText={value => {
              setEmail(value);
              resetError();
            }}
            error={fieldErrors.email}
          />
          <Input
            label='Password'
            type='password'
            value={password}
            icon='key'
            placeholder='••••••••'
            onChangeText={value => {
              setPassword(value);
              resetError();
            }}
            error={fieldErrors.password}
          />

          <AuthBannerError error={error} />

          <Button
            margin={{ marginTop: 12 }}
            title={status === 'submitting' ? 'Chargement...' : 'Connexion'}
            bg={status === 'submitting' && 'lightgrey'}
            onPress={handleLogIn}
            disabled={status === 'submitting'}
          />
          <View className='border-b-2 border-deepSage my-2 w-3/4' />
          <AppText className='font-manrope-bold text-h4 text-deepSage'>
            Pas encore de compte ?
          </AppText>
          <Button
            title='Inscrivez vous'
            bg='offwhite'
            textColor='deepSage'
            border='deepSage'
            onPress={() => navigation.navigate('SignUp')}
          />
        </AuthLayout>
      }
    </>
  );
}
