import { StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import SquaredButton from '../components/ui/SquaredButton';


export default function Profile({ navigation }) {
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
      }}>
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
        <SquaredButton title='Mes signalements' icon='paw'  onPress={() => navigation.navigate('MyReports')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
