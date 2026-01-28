import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/user';
import { getReports } from '../reducers/animals';
import { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useTheme from '../hooks/useTheme';
import SplashScreen from '../components/SplashScreen';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getEstablishments } from '../reducers/establishments';

const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;
const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

export default function SignInScreen({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [backendError, setBackendError] = useState('');

  const handleLogIn = async () => {
    if (isLoading) return; // Prevent double tap
    setErrors({ email: '', password: '' });
    setBackendError('');

    setIsLoading(true);
    // check if fields are filled
    let checkFields = {};
    if (!email) checkFields.email = 'Champ requis.';
    if (!password) checkFields.password = 'Champ requis.';
    if (Object.keys(checkFields).length > 0) {
      setErrors(checkFields);
      setIsLoading(false);
      return;
    }
    //check if email is valid
    if (!EMAIL_REGEX.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Email invalide.' }));
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setErrors(prev => ({
        ...prev,
        password: 'Votre mot de passe doit contenir au moins 6 caractères.',
      }));
      setIsLoading(false);
      return;
    }
    // post user info for login
    try {
      const userResponse = await fetch(`${BACKEND}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const userResult = await userResponse.json();
      // Response status is used as booleen
      if (!userResponse.ok) {
        setBackendError(userResult.error || 'Erreur inattendue');
        setIsLoading(false);
        return;
      }

      const token = userResult.token; // JWT token

      // FETCH  REPORTS AND DISPATCH TO REDUX
      // if (userResult.user.role === 'civil') {
      //   const animalsResponse = await fetch(`${BACKEND}/animals/populate`, {
      //     headers: { Authorization: `Bearer ${token}` },
      //   });
      //   const animalsResults = await animalsResponse.json();
      //   const establishmentsResponse = await fetch(`${BACKEND}/establishments`);
      //   const establishmentsResults = await establishmentsResponse.json();
      //   if (!animalsResponse.ok || !establishmentsResponse.ok) {
      //     setBackendError(
      //       animalsResults.error ||
      //         establishmentsResults.error ||
      //         'Erreur lors de la recuperation des signalements.'
      //     );
      //     setIsLoading(false);
      //     return;
      //   }
      //   // console.log(animalsResults);
      //   // console.log(establishmentsResults);

      //   dispatch(getReports(animalsResults.reports));
      //   dispatch(getEstablishments(establishmentsResults.result));
      // } else if (userResult.user.role === 'agent') {
      //   const animalsResponse = await fetch(`${BACKEND}/animals/agent`, {
      //     headers: { Authorization: `Bearer ${token}` },
      //   });
      //   const animalsResults = await animalsResponse.json();
      //   if (!animalsResponse.ok) {
      //     setBackendError(
      //       animalsResults.error || 'Erreur lors de la recuperation des signalements.'
      //     );
      //     setIsLoading(false);
      //     return;
      //   }
      //   // console.log('animalsresults', animalsResults);

      //   dispatch(getReports(animalsResults.reports));
      // }
      dispatch(
        login({
          ...userResult.user,
          token,
        }),
      ); //put token JWT in redux
      setPassword('');
      setEmail('');

      setIsLoading(false);
      // setIsFetching(true);
    } catch (err) {
      console.log(err);
      setBackendError('Problème de connexion au serveur');
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ?
        <View className='flex-1 justify-center bg-offwhite'>
          <SplashScreen />
        </View>
      : <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ paddingTop: 60, flexGrow: 1 }}
          style={{ backgroundColor: colors.offwhite }}>
          <View className='flex-1 justify-between items-center bg-offwhite'>
            <Text className='text-h2 text-deepSage mt-4'>Se connecter</Text>

            <View className='flex-1 w-full justify-center items-center pb-20'>
              <Input
                label='Email'
                type='email'
                icon='mail'
                placeholder='example@pawconnect.xyz'
                onChangeText={value => setEmail(value)}
                value={email}
                error={errors.email}
              />
              <Input
                label='Password'
                type='password'
                icon='key'
                placeholder='••••••••'
                onChangeText={value => setPassword(value)}
                value={password}
                error={errors.password}
              />

              {backendError && (
                <Text className='text-red-600 font-manrope text-center font-semibold text-body'>
                  {backendError}
                </Text>
              )}

              <Button
                margin={{ marginTop: 12 }}
                title={isLoading ? 'Chargement...' : 'Connexion'}
                bg={isLoading && 'lightgrey'}
                onPress={handleLogIn}
              />
              <View className='border-b-2 border-deepSage my-2 w-3/4' />
              <Text className='font-manrope text-h4 text-deepSage'>Pas encore de compte ?</Text>
              <Button
                title='Inscrivez vous'
                bg={colors.offwhite}
                textColor={colors.deepSage}
                border='deepSage'
                onPress={() => navigation.navigate('SignUp')}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      }
    </>
  );
}
