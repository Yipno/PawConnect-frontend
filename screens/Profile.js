import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import Button from '../components/ui/Button';

export default function Profile() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.offwhite,
      }}>
      <Button title='Click Me' onPress={() => alert('click')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
