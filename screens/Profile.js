import { View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import Button from '../components/ui/Button';
import SquaredButton from '../components/ui/SquaredButton';
import CustomModal from '../components/ui/CustomModal';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reducers/user';
import { emptyAnimals } from '../reducers/animals';
import ResourcesModalContent from '../components/ui/ResourcesModalContent';
import ProfileModalContent from '../components/ui/ProfileModalContent';
import FaqModalContent from '../components/ui/FaqModalContent';
import { updateUser } from '../reducers/user';
import EstablishmentsModalContent from '../components/ui/EstablishmentsModalContent';
import AppText from '../components/ui/AppText';

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
  const [establishmentsVisible, setEstablishmentsVisible] = useState(false);

  const [fullscreenModalVisible, setFullscreenModalVisible] = useState(false);
  const [form, setForm] = useState({
    lastname: user.lastName || '',
    firstname: user.firstName || '',
    phone: user.phone || '',
    email: user.email || '',
    password: '',
    establishment: user.establishment || '',
  });

  useEffect(() => {
    setForm({
      lastname: user.lastName || '',
      firstname: user.firstName || '',
      email: user.email || '',
      password: '', // toujours vide pour le password
      confirmPassword: '',
      establishment: user.establishment || '',
    });
  }, [user]);

  const logoutUser = () => {
    dispatch(logout());
    dispatch(emptyAnimals());
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
          <AppText className='text-h2 font-manrope-bold text-deepSage mb-1'>Menu</AppText>
          <View className='w-11/12 h-full flex-row flex-wrap justify-evenly'>
            {/* <SquaredButton
          keyboardShouldPersistTaps='handled'
        >
          <AppText className='text-h2 font-manrope-bold text-deepSage mt-4 mb-4'>Menu</AppText>
          <View className='w-11/12 h-full flex-row flex-wrap justify-evenly'>
           {/* <SquaredButton
              title={'Mes\nsignalements'}
              icon='paw'
              onPress={() =>
                user.role === 'civil'
                  ? navigation.navigate('MyReports')
                  : navigation.navigate('Report')
              }
            /> */}

            <SquaredButton
              title='Mon profil'
              icon='person'
              onPress={() => setProfileVisible(true)}
            />
            {user.role === 'civil' ? (
              <SquaredButton
                title='Associations'
                icon='people-circle'
                onPress={() => setEstablishmentsVisible(true)}
              />
            ) : (
              <SquaredButton
                title='Mon organisation'
                icon='business'
                onPress={() => setEstablishmentsVisible(true)}
              />
            )}

            <SquaredButton title='FAQ' icon='help-circle' onPress={() => setFaqVisible(true)} />
            <SquaredButton
              title='Ressources utiles'
              icon='search'
              onPress={() => setResourcesVisible(true)}
            />
            <SquaredButton title='Paramètres' icon='cog' />
            <AppText className='w-11/12 text-center mt-4 mb-6 font-bold'>
              Signaler un problème avec l'application
            </AppText>

            <Button
              title='Se déconnecter'
              bg={colors.softOrange}
              textColor={colors.offwhite}
              onPress={() => {
                dispatch(emptyAnimals());
                dispatch(logout());
              }}
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
          <CustomModal
            visible={establishmentsVisible}
            onClose={() => setEstablishmentsVisible(false)}
            content={<EstablishmentsModalContent />}
            fullscreen
            animationType={'slide'}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
