import { StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SquaredButton from '../components/ui/SquaredButton';
import CustomModal from '../components/ui/CustomModal';
import Establishments from '../components/ui/Establishments';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/user';


export default function Profile() {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [fullscreenModalVisible, setFullscreenModalVisible] = useState(false);
  const { colors } = useTheme();

  // ORGANISATION MODAL
  const [orgaModalVisible, setOrgaModalVisible] = useState(false);


  const handleClick = () => {
    Alert.alert(
      'Card pressed',
      "This will open full screen modal with all user's infos so he can modify them",
      [
        { text: 'Cancel', style: 'destructive', onPress: () => Alert.alert('Cancel Pressed') },
        { text: 'Understood', onPress: () => console.log('OK') },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'start',
        alignItems: 'center',
        backgroundColor: colors.offwhite,
      }}>
      {/* TEST : Modal classique et full screen */}
      <View className='w-full flex items-center mt-6'>
        <Button title='Modal classique' onPress={() => setModalVisible(true)} />
      </View>

      <View className='w-full flex items-center mt-6'>
        <Button title='Modal Full Screen' onPress={() => setFullscreenModalVisible(true)} />
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title='Modal classique'
        content={<Text>Message de ma modale </Text>}
      />
      <CustomModal
        visible={fullscreenModalVisible}
        onClose={() => setFullscreenModalVisible(false)}
        title='Modal fullscreen'
        content={<Text>Cette modale prend tout l'écran </Text>}
        fullscreen={true}
      />
      <Button bg={colors.danger} title='Log Out' onPress={() => dispatch(logout())} />
      <Button
        bg={colors.offwhite}
        textColor={colors.deepSage}
        border='deepSage'
        title='Click Me'
        onPress={() => alert('click')}
      />
      <View className='w-11/12 h-full flex-row flex-wrap justify-evenly'>
        <SquaredButton onPress={() => setOrgaModalVisible(true)} />
          <CustomModal
        visible={orgaModalVisible}
        onClose={() => setOrgaModalVisible(false)}
        content={<Establishments/>}
        fullscreen={true}
      />
        <SquaredButton title='FAQ' icon='help-circle' />
        <SquaredButton title='Paramètres' icon='cog' />
        <SquaredButton title='Mes signalements' icon='paw'  onPress={() => navigation.navigate('MyReports')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
