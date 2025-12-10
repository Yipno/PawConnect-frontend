import { Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Text>HomeScreen</Text>

      <Button
        title="Aller à SignUp"
        onPress={() => navigation.navigate('SignUp')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
