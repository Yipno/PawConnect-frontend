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
import EstablishmentsModalContent from '../components/ui/EstablishmentsModalContent';

export default function Profile({ navigation }) {
  const { colors } = useTheme();

  const user = useSelector(state => state.user.value);
  const dispatch = useDispatch();

  const [profileVisible, setProfileVisible] = useState(false);
  const [resourcesVisible, setResourcesVisible] = useState(false);
  const [faqVisible, setFaqVisible] = useState(false);
  const [establishmentsVisible, setEstablishmentsVisible] = useState(false);

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
          <Text className='text-h2 font-manrope font-bold text-deepSage mt-4 mb-4'>Menu</Text>
          <View className='w-11/12 h-full flex-row flex-wrap justify-evenly'>
           {/* <SquaredButton
              title={'Mes\nsignalements'}
              icon='paw'
              onPress={() =>
                user.role === 'civil'
                  ? navigation.navigate('MyReports')
                  : navigation.navigate('Report')
              }
            />*/}
 <SquaredButton
              title='Mon profil'
              icon='person'
              onPress={() => setProfileVisible(true)}
            />
            {user.role === 'civil' ? (
              <SquaredButton title='Associations' icon='people-circle' onPress={() => setEstablishmentsVisible(true)} />
            ) : (
              <SquaredButton title='Mon organisation' icon='business' onPress={() => setEstablishmentsVisible(true)} />
            )}
           
            <SquaredButton title='FAQ' icon='help-circle' onPress={() => setFaqVisible(true)} />
            <SquaredButton
              title='Ressources utiles'
              icon='search'
              onPress={() => setResourcesVisible(true)}
            />
            <SquaredButton title='Paramètres' icon='cog' />
            <Text className='w-11/12 text-center mt-4 mb-6 font-bold'>
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
