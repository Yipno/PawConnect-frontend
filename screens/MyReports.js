import {  StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';
import { useEffect, useState } from 'react';


export default function MyReports() {
  const [reports, setReports] = useState([]);

  const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS;
  
  useEffect(()=>{
    const userId = '6936fe386fb328f6ec180ea6'; 
   fetch(`${BACKEND_ADDRESS}/animals/civil/${userId}`)
    .then(res=>res.json())
     .then(data => {
 if (data.result) {
          setReports(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);


  return (
   
   <SafeAreaView style={{ flex: 1 }} className="bg-offwhite">
      <Text className="text-h1  text-center my-4">Mes Signalements</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {reports.map(report => (
          <Card
            key={report._id}
            title={report.animalType}
            description={report.desc}
            date={new Date(report.date).toLocaleDateString()}
            place={`${report.location.lat}, ${report.location.long}`}
            priority={report.status} 
            photoUrl={report.photoUrl}
            onPress={() => console.log('Card pressed', report._id)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});