import { useState } from 'react';
import { Switch, View, Alert } from 'react-native';
import { useSignUp } from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import AppText from '../components/shared/AppText';
import AuthLayout from '../components/auth/AuthLayout';
import AuthBannerError from '../components/auth/AuthBannerError';

export default function SignUp({ navigation }) {
  const { colors } = useTheme();
  const { submit, status, error, fieldErrors, resetError } = useSignUp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [establishment, setEstablishment] = useState('');
  const [accountType, setAccountType] = useState('user');

  const handleRegister = async () => {
    const result = await submit({
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
      establishment,
      accountType,
    });
    if (result) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
      setEstablishment('');
      Alert.alert(
        'Compte créé',
        'Votre compte a bien été créé. Vous pouvez maintenant vous connecter',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('SignIn'),
          },
        ],
      );
    }
  };

  return (
    <AuthLayout title="S'enregistrer">
      {/* Formulaire */}
      <Input
        label='Prénom'
        placeholder='Votre prénom'
        value={firstName}
        onChangeText={value => {
          setFirstName(value);
          resetError();
        }}
        error={fieldErrors.firstName}
      />

      <Input
        label='Nom'
        placeholder='Votre nom'
        value={lastName}
        onChangeText={value => {
          setLastName(value);
          resetError();
        }}
        error={fieldErrors.lastName}
      />

      <Input
        label='Email'
        placeholder='example@pawconnect...'
        type='email'
        icon='mail'
        value={email}
        onChangeText={value => {
          setEmail(value);
          resetError();
        }}
        autoCapitalize='none' //verif dans composant Input
        autoCorrect={false} //verif dans composant Input
        error={fieldErrors.email}
      />

      <Input
        label='Password'
        placeholder='Votre mot de passe'
        type='password'
        icon='key'
        value={password}
        onChangeText={value => {
          setPassword(value);
          resetError();
        }}
        autoCapitalize='none' //verif dans composant Input
        autoCorrect={false} //verif dans composant Input
        error={fieldErrors.password}
      />

      <Input
        label='Password'
        placeholder='Confirmez votre mot de passe'
        type='password'
        icon='key'
        value={passwordConfirm}
        onChangeText={value => {
          setPasswordConfirm(value);
          resetError();
        }}
        autoCapitalize='none' //verif dans composant Input
        autoCorrect={false} //verif dans composant Input
        error={fieldErrors.passwordConfirm}
      />

      {/* Button Switch type account  */}
      <View className='flex-row items-center justify-center w-[360px] my-4'>
        <Switch
          className='mr-4'
          value={accountType === 'pro'}
          onValueChange={value => setAccountType(value ? 'pro' : 'user')}
          thumbColor='#FAF9F7'
          trackColor={{ false: '#ccc', true: colors.deepSage }}
        />
        <AppText className='text-lg font-bold text-deepSage'>Pro/Association</AppText>
      </View>

      {/* Add Input for Pro/Asso  */}
      {accountType === 'pro' && (
        <Input
          label='Association/Etablissement'
          placeholder='Votre association ou etablissement'
          icon='paw'
          value={establishment}
          onChangeText={value => {
            setEstablishment(value);
            resetError();
          }}
          error={fieldErrors.establishment}
        />
      )}

      <AuthBannerError error={error} />

      <Button
        title={status === 'submitting' ? 'Chargement...' : 'Créer mon compte'}
        onPress={handleRegister}
        disabled={status === 'submitting'}
      />

      {/* ligne  */}
      <View className='border-b-2 border-deepSage my-2 w-3/4' />
      <View className='w-full items-center'>
        <AppText className='font-manrope-bold text-h4 text-deepSage'>Déjà inscrit ?</AppText>
        <Button
          bg='offwhite'
          textColor='deepSage'
          border='deepSage'
          title='Se connecter'
          onPress={() => navigation.navigate('SignIn')}
          disabled={status === 'submitting'}
        />
      </View>
    </AuthLayout>
  );
}
