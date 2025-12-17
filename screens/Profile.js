import { Text, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import Button from '../components/ui/Button';
import SquaredButton from '../components/ui/SquaredButton';
import CustomModal from '../components/ui/CustomModal';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reducers/user';
import { emptyAnimals } from '../reducers/animals';
import ResourcesModalContent from '../components/ui/ResourcesModalContent';
import ProfileModalContent from '../components/ui/ProfileModalContent';
import FaqModalContent from '../components/ui/FaqModalContent';

export default function Profile({ navigation }) {
  const { colors } = useTheme();

  const user = useSelector(state => state.user.value);
  const dispatch = useDispatch();

  const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

  const EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const [profileVisible, setProfileVisible] = useState(false);
  const [resourcesVisible, setResourcesVisible] = useState(false);
  const [faqVisible, setFaqVisible] = useState(false);
  
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
      headers: { 'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`, //JWT Token 
       },
      body: JSON.stringify({

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

  const logoutUser = () => {
    dispatch(logout());
    dispatch(emptyAnimals());
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.offwhite }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 50,
            alignItems: 'center',
          }}
          keyboardShouldPersistTaps='handled'
        >
          <Text className='text-h2 font-manrope font-bold text-deepSage mb-1'>Menu</Text>
          <View className='w-11/12 h-full flex-row flex-wrap justify-evenly'>
            <SquaredButton
              title={'Mes\nsignalements'}
              icon='paw'
              onPress={() =>
                user.role === 'civil'
                  ? navigation.navigate('MyReports')
                  : navigation.navigate('Report')
              }
            />

            {user.role === 'civil' ? (
              <SquaredButton title='Mes associations' icon='people-circle' />
            ) : (
              <SquaredButton title='Mon organisation' icon='business' />
            )}
            <SquaredButton
              title='Mon profil'
              icon='person'
              onPress={() => setProfileVisible(true)}
            />
            <SquaredButton title='FAQ' icon='help-circle' onPress={() => setFaqVisible(true)} />
            <SquaredButton
              title='Ressources utiles'
              icon='search'
              onPress={() => setResourcesVisible(true)}
            />
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
            visible={profileVisible}
            onClose={() => setProfileVisible(false)}
            content={<ProfileModalContent />}
            fullscreen
            animationType={'slide'}
          />
          <CustomModal
            visible={resourcesVisible}
            onClose={() => setResourcesVisible(false)}
            content={<ResourcesModalContent />}
            fullscreen
            animationType={'slide'}
          />
          <CustomModal
            visible={faqVisible}
            onClose={() => setFaqVisible(false)}
            content={<FaqModalContent />}
            fullscreen
            animationType={'slide'}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
