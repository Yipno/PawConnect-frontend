import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Switch,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { login } from '../reducers/user';

const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;

export default function SignUp({ navigation }) {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const [signUpFirstName, setSignUpFirstName] = useState('');
  const [signUpLastName, setSignUpLastName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpPasswordConfirm, setSignUpPasswordConfirm] = useState('');
  const [signUpEstablishment, setSignUpEstablishment] = useState('');

  const [accountType, setAccountType] = useState('user');
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    establishment: '',
  });

  const [backendError, setBackendError] = useState('');

  const handleRegister = async () => {
    if (isLoading) return; // Prevent double tap
    setErrors({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      establishment: '',
    });
    setBackendError('');
    setIsLoading(true);

    //check if fields are completed
    const checkFields = {};

    if (!signUpFirstName) checkFields.firstName = 'Champ requis.';
    if (!signUpLastName) checkFields.lastName = 'Champ requis.';
    if (!signUpEmail) checkFields.email = 'Champ requis.';
    if (!signUpPassword) checkFields.password = 'Champ requis.';
    if (!signUpPasswordConfirm) checkFields.passwordConfirm = 'Champ requis.';

    if (
      accountType === 'pro' &&
      (!signUpEstablishment || signUpEstablishment.trim().length === 0)
    ) {
      checkFields.establishment = "L'établissement est requis pour un compte pro/association.";
    }

    if (Object.keys(checkFields).length > 0) {
      setErrors(checkFields);
      setIsLoading(false);
      return;
    }

    //check the email format
    if (!EMAIL_REGEX.test(signUpEmail)) {
      setErrors(prev => ({ ...prev, email: 'Email invalide.' }));
      setIsLoading(false);
      return;
    }

    //check password length
    if (signUpPassword.length < 6) {
      setErrors(prev => ({
        ...prev,
        password: 'Votre mot de passe doit contenir au moins 6 caractères',
      }));
      setIsLoading(false);
      return;
    }

    //check password confirmation
    if (signUpPassword !== signUpPasswordConfirm) {
      setErrors(prev => ({
        ...prev,
        passwordConfirm: 'Les mots de passe ne sont pas identiques',
      }));
      setIsLoading(false);
      return;
    }

    //check establishment for pro account
    if (
      accountType === 'pro' &&
      (!signUpEstablishment || signUpEstablishment.trim().length === 0)
    ) {
      setErrors(prev => ({
        ...prev,
        establishment: `L'établissement est requis pour un compte pro/association`,
      }));
      setIsLoading(false);
      return;
    }

    //selection of role and establishment according to account type
    const roleNewUser = accountType === 'pro' ? 'agent' : 'civil';
    const establishmentNewUser = accountType === 'pro' ? signUpEstablishment : null;

    try {
      const response = await fetch(`${BACKEND}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: signUpFirstName,
          lastName: signUpLastName,
          email: signUpEmail,
          password: signUpPassword,
          role: roleNewUser,
          establishmentRef: establishmentNewUser,
        }),
      });

      const data = await response.json();

      if (data.result) {
        //Stock in reducer/user
        dispatch(login(data.user));

        //reset inputs
        setSignUpFirstName('');
        setSignUpLastName('');
        setSignUpEmail('');
        setSignUpPassword('');
        setSignUpPasswordConfirm('');
        setAccountType('user');
        setSignUpEstablishment('');
        setIsLoading(false);
      } else {
        //erreur backend
        setBackendError(data.error || 'Une erreur est survenue.');
        setIsLoading(false);
        return;
      }
    } catch (error) {
      setBackendError('Problème de connexion au serveur');
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className='bg-offwhite'
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 50, //to avoid cutting of the last input
        }}
        keyboardShouldPersistTaps='handled'>
        <SafeAreaView
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
          <Text
            className='text-2xl font-bold text-center mb-4 mt-4'
            style={{ color: colors.deepSage }}>
            Créer un compte
          </Text>

          {/* Formulaire */}
          <Input
            label='Prénom'
            placeholder='Votre prénom'
            value={signUpFirstName}
            onChangeText={setSignUpFirstName}
            error={errors.firstName}
          />

          <Input
            label='Nom'
            placeholder='Votre nom'
            value={signUpLastName}
            onChangeText={setSignUpLastName}
            error={errors.lastName}
          />

          <Input
            label='Email'
            placeholder='example@pawconnect...'
            type='email'
            icon='mail'
            value={signUpEmail}
            onChangeText={setSignUpEmail}
            autoCapitalize='none' //verif dans composant Input
            autoCorrect={false} //verif dans composant Input
            error={errors.email}
          />

          <Input
            label='Password'
            placeholder='Votre mot de passe'
            type='password'
            icon='key'
            value={signUpPassword}
            onChangeText={setSignUpPassword}
            autoCapitalize='none' //verif dans composant Input
            autoCorrect={false} //verif dans composant Input
            error={errors.password}
          />

          <Input
            label='Password'
            placeholder='Confirmez votre mot de passe'
            type='password'
            icon='key'
            value={signUpPasswordConfirm}
            onChangeText={setSignUpPasswordConfirm}
            autoCapitalize='none' //verif dans composant Input
            autoCorrect={false} //verif dans composant Input
            error={errors.passwordConfirm}
          />

          {/* Button Switch type account  */}
          <View className='flex-row items-center justify-center w-[360px] my-4'>
            <Switch
              className='mr-4'
              value={accountType === 'pro'}
              onValueChange={value => setAccountType(value ? 'pro' : 'user')}
              thumbColor='#fff'
              trackColor={{ false: '#ccc', true: colors.deepSage }}
            />
            <Text className='text-lg font-semibold' style={{ color: colors.deepSage }}>
              Pro/Association
            </Text>
          </View>

          {/* Add Input for Pro/Asso  */}
          {accountType === 'pro' && (
            <Input
              label='Association/Etablissement'
              placeholder='Votre association ou etablissement'
              icon='paw'
              value={signUpEstablishment}
              onChangeText={setSignUpEstablishment}
              error={errors.establishment}
            />
          )}

          {backendError && (
            <Text className='text-red-600 font-manrope text-center font-semibold text-body'>
              {backendError}
            </Text>
          )}

          <Button
            title={isLoading ? 'Chargement...' : 'Créer mon compte'}
            onPress={handleRegister}
            disabled={isLoading}
          />

          {/* ligne  */}
          <View className='h-[1px] bg-deepSage my-3 w-[360px] mx-auto' />
          <View className='items-center'>
            <Text className='font-manrope text-h4 text-deepSage'>Pas encore de compte ?</Text>
            <Button
              bg={colors.offwhite}
              textColor={colors.deepSage}
              border='deepSage'
              title='Se connecter'
              onPress={() => navigation.navigate('SignIn')}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
