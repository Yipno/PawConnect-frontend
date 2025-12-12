import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';
// import { reportsData } from '../data/reportsData';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getReports } from '../reducers/animals';

export default function Reports() {
  const dispatch = useDispatch();
  const reports = useSelector(state => state.animals.value);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND}/animals`);
        const data = await response.json();
        dispatch(getReports(data.reports));
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
    // dispatch(getReports(reportsData));
  }, []);

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
        {reports.map(r => (
          <Card key={r._id} {...r} />
        ))}
        <Card
          title='Chien attaché et surtout trop long'
          photoUrl='https://res.cloudinary.com/dourrti76/image/upload/v1764838194/samples/animals/cat.jpg'
          priority='Modéré'
          date='2 jours'
          place='1km'
          onPress={handleClick}
        />
        <Card />
        <View style={{ marginBottom: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
