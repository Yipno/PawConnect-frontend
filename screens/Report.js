import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Reports() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text className=' text-darkSage' style={{ fontSize: 20 }}>
        Reports
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
