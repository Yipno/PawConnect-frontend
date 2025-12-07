import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Profile() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'start',
        alignItems: 'center',
        backgroundColor: colors.offwhite,
      }}>
      <Input label='FirstName' />
      <Input label='LastName' />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
