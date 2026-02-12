import React from 'react';
import { View, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout, updateUser } from '../../reducers/user';
import useTheme from '../../hooks/useTheme';
import AppText from '../shared/AppText';

export default function ProfileModalContent() {
  const { colors } = useTheme();
  const user = useSelector(state => state.user.value);
  const dispatch = useDispatch();

  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;
  const EMAIL_REGEX =
    /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;

  const [form, setForm] = useState({
    lastname: user.lastName || '',
    firstname: user.firstName || '',
    email: user.email || '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    setForm({
      lastname: user.lastName || '',
      firstname: user.firstName || '',
      email: user.email || '',
      password: '',
      confirmPassword: '',
    });
  }, [user]);

  const askUpdateConfirmation = () => {
    //  Vérifier si au moins un champ a changé
    const isModified =
      form.lastname !== user.lastName ||
      form.firstname !== user.firstName ||
      form.email !== user.email ||
      (form.password && form.password.length > 0);

    if (!isModified) {
      Alert.alert('Information', 'Aucune donnée modifiée');
      return;
    }

    if (form.password.length > 0 && form.password !== form.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    Alert.alert('Confirmer la modification', 'Voulez-vous enregistrer vos modifications ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Modifier', onPress: () => updateProfile() },
    ]);
  };

  const updateProfile = () => {
    console.log('updateProfile appelé');
    console.log('Formulaire envoyé :', form);
    console.log('Token :', user.token);
    console.log({
      firstName: form.firstname,
      lastName: form.lastname,
      email: form.email,
      password: form.password,
      establishment: form.establishment,
    });
    fetch(`${BACKEND}/users/updateProfile`, {
      method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user.token}`,// token JWT
  },
      body: JSON.stringify({
        firstName: form.firstname,
        lastName: form.lastname,
        email: form.email,
        password: form.password,
      }),
    })
      .then(res => res.json())
      .then(data => {
  
        if (!data.result) {
          Alert.alert('Erreur', data.error);
          return;
        }

        dispatch(updateUser(data.user));

        Alert.alert('Succès', data.message);
      })
      .catch(() => {
        Alert.alert('Erreur', 'Impossible de contacter le serveur');
      });
  };

  const handleDeleteUser = () => {
    Alert.alert('Supprimer mon compte', 'Cette action est définitive. Etes-vous sûre de vouloir supprimer votre compte ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: deleteUser },
    ]);
  };
  const deleteUser = () => {
    fetch(`${BACKEND}/users/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          Alert.alert('Important', data.message);
          dispatch(logout());
        } else {
          Alert.alert('Erreur', data.error);
        }
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Erreur', 'Impossible de contacter le serveur');
      });
  };

  return (
    <KeyboardAvoidingView
      className='bg-offwhite'
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
     <ScrollView>
        <SafeAreaView 
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}>
    
      <AppText className='text-h2 text-center font-manrope-bold text-deepSage mb-4'>
        Mon Profil
      </AppText>
 <View className='w-auto mb-4 mt-4'>
  
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

      {/*{user.role === 'agent' && (
                  <Input
                    label='Téléphone'
                    placeholder='Ecrivez votre numéro de téléphone'
                    type='number'
                    icon='call'
                    value={form.phone}
                    onChangeText={value => setForm({ ...form, phone: value })}
                  />
                )}*/}

      <Input
        label='Mot de passe modifiable'
        placeholder=' nouveau'
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

      <View>
        <Button
          title='Modifier mon profil'
          textColor='#FAF9F7'
          width='w-full mt-6'
          onPress={askUpdateConfirmation}
        />
        <Button
          title='Supprimer mon compte'
          bg='#E74C3C'
          width='w-full mt-2'
          textColor='#FAF9F7'
          onPress={handleDeleteUser}
        />
      </View>
    </View>

     </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
