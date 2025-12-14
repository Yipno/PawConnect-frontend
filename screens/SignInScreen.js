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
      const userResponse = await fetch(`${BACKEND}/users/auth`, {
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

      // FETCH  REPORTS AND DISPATCH TO REDUX
      if (userResult.user.role === 'civil') {
        const animalsResponse = await fetch(`${BACKEND}/animals/${userResult.user.id}`);
        const animalsResults = await animalsResponse.json();
        if (!animalsResponse.ok) {
          setBackendError(
            animalsResults.error || 'Erreur lors de la recuperation des signalements.'
          );
          setIsLoading(false);
          return;
        }
        console.log(animalsResults);
        dispatch(getReports(animalsResults.userReports));
      } else if (userResult.user.role === 'agent') {
        const animalsResponse = await fetch(`${BACKEND}/animals`);
        const animalsResults = await animalsResponse.json();
        if (!animalsResponse.ok) {
          setBackendError(
            animalsResults.error || 'Erreur lors de la recuperation des signalements.'
          );
          setIsLoading(false);
          return;
        }
        dispatch(getReports(animalsResults.reports));
      }
      dispatch(login(userResult.user));
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
      {isLoading ? (
        <SplashScreen />
      ) : (
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps='handled'
          contentContainerStyle={{ paddingTop: 60 }}
          style={{ flex: 1, backgroundColor: colors.offwhite }}>
          <View className='justify-between items-center bg-offwhite '>
            <Text className='text-h2 text-darkSage mt-24'>Se connecter</Text>
            <Button
              title={'cheatcode'}
              onPress={() => {
                setEmail('luke@mi.io');
                setPassword('007007');
              }}
            />
            <Button
              title={'cheatcode agent'}
              onPress={() => {
                setEmail('bond@mi.io');
                setPassword('007007');
              }}
            />

            <View className='h-[400px] w-full justify-evenly items-center my-28'>
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
              <View className='border-[1px] border-deepSage w-3/4'></View>
              <View className='items-center w-full'>
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
          </View>
        </KeyboardAwareScrollView>
      )}
    </>
  );
}
