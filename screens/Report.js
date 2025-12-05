import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Reports() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text className='text-body m-safe-offset-4 text-darkSage'>
        Consequat tempor aliquip labore incididunt adipisicing id. Qui veniam est laborum est cillum
        do. Do culpa eu et nisi. Nulla nostrud minim minim minim ad adipisicing tempor eu. Culpa ex
        esse sunt non adipisicing. Aliqua cupidatat ullamco sunt id pariatur culpa pariatur pariatur
        dolore mollit veniam mollit esse.
      </Text>
      <Text className='text-body text-darkSage'>Reports</Text>
      <Text className=' text-darkSage' style={{ fontSize: 20 }}>
        Reports
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
