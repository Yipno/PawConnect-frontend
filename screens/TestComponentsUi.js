import { StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import SquaredButton from '../components/shared/SquaredButton';
import CustomModal from '../components/shared/CustomModal';
import { useState } from 'react';
import AppText from '../components/shared/AppText';

export default function TestComponentsUi() {
  const [modalVisible, setModalVisible] = useState(false);
  const [fullscreenModalVisible, setFullscreenModalVisible] = useState(false);
  const { colors } = useTheme();

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
      }}
    >
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
        content={<AppText>Message de ma modale </AppText>}
      />
      <CustomModal
        visible={fullscreenModalVisible}
        onClose={() => setFullscreenModalVisible(false)}
        title='Modal fullscreen'
        content={<AppText>Cette modale prend tout l'écran </AppText>}
        fullscreen={true}
      />
      <Input label='FirstName' />
      <Input label='Email' placeholder='example@pawconnect...' type='email' icon='mail' />
      <Input label='Password' placeholder='••••••••' type='password' icon='key' />
      <Button title='Click Me' onPress={() => alert('click')} />
      <Button
        bg={colors.offwhite}
        textColor={colors.deepSage}
        border='deepSage'
        title='Click Me'
        onPress={() => alert('click')}
      />
      <View className='w-11/12 h-full flex-row flex-wrap justify-evenly'>
        <SquaredButton onPress={handleClick} />
        <SquaredButton title='FAQ' icon='help-circle' />
        <SquaredButton title='Paramètres' icon='cog' />
        <SquaredButton
          title='Mes signalements'
          icon='paw'
          onPress={() => navigation.navigate('MyReports')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
