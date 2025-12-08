import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';

export default function Reports() {
  const handleClick = () => {
    Alert.alert('Card pressed', 'This will open full screen modal with all infos of this report', [
      { text: 'Cancel', style: 'destructive', onPress: () => Alert.alert('Cancel Pressed') },
      { text: 'Understood', onPress: () => console.log('OK') },
    ]);
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      className='bg-offwhite'>
      <Text className='text-h1 font-manrope'>Signalements</Text>
      <ScrollView style={{ flex: 1, width: '100%' }}>
        <Card
          title='Chien attaché et surtout trop long'
          photoUrl='https://res.cloudinary.com/dourrti76/image/upload/v1764838194/samples/animals/cat.jpg'
          priority='Modéré'
          date='2 jours'
          place='1km'
          onPress={handleClick}
        />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <View style={{ marginBottom: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
