import { Text, View, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SquaredButton from '../components/ui/SquaredButton';
import CustomModal from '../components/ui/CustomModal';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUser } from '../reducers/user';

export default function Profile() {
  const user = useSelector(state => state.user.value);
  const dispatch = useDispatch();

  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const [fullscreenModalVisible, setFullscreenModalVisible] = useState(false);
  const [form, setForm] = useState({
    lastname: user.lastName || '',
    firstname: user.firstName || '',
    phone: user.phone || '',
    email: user.email || '',
    password: '',
    establishmentRef: user.establishmentRef || '',
  });

  const { colors } = useTheme();

  useEffect(() => {
    setForm({
      lastname: user.lastName || '',
      firstname: user.firstName || '',
      email: user.email || '',
      password: '', // toujours vide pour le password
      confirmPassword: '',
      establishmentRef: user.establishmentRef || '',
    });
  }, [user]);

  const showModalProfil = () => {
    setFullscreenModalVisible(true);
  };

  const askUpdateConfirmation = () => {
    Alert.alert('Confirmer la modification', 'Voulez-vous enregistrer vos modifications ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Modifier', onPress: () => updateProfile() },
    ]);
  };

  const updateProfile = () => {
    if (form.password.length > 0 && form.password !== form.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    fetch(`${BACKEND}/users/updateProfile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: user.token,
        firstName: form.firstname,
        lastName: form.lastname,
        email: form.email,
        password: form.password || undefined,
        establishmentRef: form.establishmentRef,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          console.log('Profil mis à jour !', data.user);

          dispatch(updateUser(data.user));

          Alert.alert('Profil mis à jour');
        } else {
          console.log('Erreur update :', data.error);
        }
      })
      .catch(err => {
        console.log('Erreur réseau :', err);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.offwhite }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 50,
            alignItems: 'center',
          }}
          keyboardShouldPersistTaps='handled'>
          <Text className='text-h1 font-manrope font-bold text-deepSage my-4 mb-8'>Menu</Text>
          <View className='w-11/12 h-full flex-row flex-wrap justify-evenly'>
            <SquaredButton
              title={'Mes\nsignalements'}
              icon='paw'
              // onPress={() => navigation.navigate('MyReports')}
            />

            {user.role === 'civil' ? (
              <SquaredButton title='Mes associations' icon='people-circle' />
            ) : (
              <SquaredButton title='Mon organisation' icon='business' />
            )}
            <SquaredButton title='Mon profil' icon='person' onPress={showModalProfil} />
            <SquaredButton title='FAQ' icon='help-circle' />
            <SquaredButton title='Ressources utiles' icon='search' />
            <SquaredButton title='Paramètres' icon='cog' />
            <Text className='w-11/12 text-center mt-4 font-bold'>
              Signaler un problème avec l'application
            </Text>

            <Button
              title='Me déconnecter'
              bg='#f4a76a'
              textColor='#FAF9F7'
              onPress={() => dispatch(logout())}
            />
          </View>

          <CustomModal
            visible={fullscreenModalVisible}
            onClose={() => setFullscreenModalVisible(false)}
            title={'Mon profil'}
            content={
              <View className='w-full'>
                <Input
                  label={'Nom'}
                  placeholder={'Ecrivez votre nom'}
                  onChangeText={value => setForm({ ...form, lastname: value })}
                  value={form.lastname}
                  error={form.lastname.length === 0 ? 'Nom obligatoire' : ''}
                />

                <Input
                  label='Prénom'
                  placeholder='Écrivez votre prénom'
                  icon='person'
                  value={form.firstname}
                  onChangeText={value => setForm({ ...form, firstname: value })}
                  error={form.firstname.length === 0 ? 'Prénom obligatoire' : ''}
                />

                <Input
                  label='Email'
                  placeholder='exemple@mail.com'
                  type='email'
                  icon='mail'
                  value={form.email}
                  onChangeText={value => setForm({ ...form, email: value })}
                  error={!form.email || !EMAIL_REGEX.test(form.email) ? 'Email invalide' : ''}
                />

                {user.role === 'agent' && (
                  <Input
                    label='Téléphone'
                    placeholder='Ecrivez votre numéro de téléphone'
                    type='number'
                    icon='call'
                    value={form.phone}
                    onChangeText={value => setForm({ ...form, phone: value })}
                  />
                )}

                <Input
                  label='Mot de passe'
                  placeholder='********'
                  type='password'
                  icon='lock-closed'
                  value={form.password}
                  onChangeText={value => setForm({ ...form, password: value })}
                  error={
                    form.password.length > 0 && form.password.length < 6
                      ? 'Mot de passe invalide, minimum 6 caractères'
                      : ''
                  }
                />

                {form.password.length > 0 && (
                  <Input
                    label='Confirmez votre mot de passe'
                    placeholder='********'
                    type='password'
                    icon='lock-closed'
                    value={form.confirmPassword}
                    onChangeText={value => setForm({ ...form, confirmPassword: value })}
                    error={
                      form.confirmPassword.length > 0 && form.password !== form.confirmPassword
                        ? 'Les mots de passe ne correspondent pas'
                        : ''
                    }
                  />
                )}
              </View>
            }
            button={
              <>
                <Button
                  title='Modifier mon profil'
                  textColor='#FAF9F7'
                  onPress={askUpdateConfirmation}
                />
                <Button title='Supprimer mon compte' bg='#E74C3C' textColor='#FAF9F7' />
              </>
            }
            fullscreen={true}
            animationType={'slide'}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
