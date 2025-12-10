import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getReports } from '../reducers/animals';
import 'moment/locale/fr';
moment.locale('fr');

export default function MyReports() {
  const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS;
  const reports = useSelector((state) => state.animals.value);
  const dispatch = useDispatch();

  // Test avec des signalements fictifs placés dans le store
  useEffect(() => {
    dispatch(
      getReports([
        {
          _id: '1',
          animalType: 'chien',
          desc: 'perdu',
          date: new Date(Date.now() - 3600 * 1000),
          location: { lat: 0, long: 0 },
          status: 'nouveau',
          photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800',
        },
        {
          _id: '2',
          animalType: 'chien',
          desc: 'errant',
          date: new Date(),
          location: { lat: 0, long: 0 },
          status: 'en cours',
          photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800',
        },
      ])
    );
  }, [dispatch]);

  //Bloc de code à déplacer dans le screen Map parcours utilisateur role civil

  /*
const user = useSelector(state => state.user.value);
const token = user.token;
Test avec un utilisateur qui a signalé deux animaux 
const token = '_JE8aaPrzBAp1u7saekiQyeWz7TGhf-v'; 
const [reports, setReports] = useState([]);

  useEffect(()=>{
     if (!token) return;
   
   fetch(`${BACKEND_ADDRESS}/animals/civil/${token}`)
    .then(res=>res.json())
     .then(data => {
 if (data.result) {
          setReports(data.data);
        }
      })
      .catch(err => console.error(err));
  }, [token]);
  */

  return (
    <SafeAreaView className='flex-1 bg-offwhite justify-items-center '>
      <Text className='text-h1 font-manrope text-center font-bold text-deepSage my-4 '>
        Mes signalements
      </Text>
      <ScrollView className='flex-1 w-full'>
        {reports.length === 0 ? (
          <Text className='text-center mt-4'>Aucun signalement pour le moment.</Text>
        ) : (
          reports.map((report) => (
            <Card
              key={report._id}
              title={report.animalType}
              description={report.desc}
  // Pour l’instant, on utilise directement report.date avec Moment.
// Ça fonctionne en test, mais si un jour le backend renvoie une date en string,
// il faudra peut-être convertir en new Date() pour éviter des erreurs.
              date={moment(report.date).fromNow()}
              place={`${report.location.lat}, ${report.location.long}`}
              priority={report.status}
              photoUrl={report.photoUrl}
              onPress={() => console.log('Card pressed', report._id)}
            />
          ))
        )}
        <View style={{ marginBottom: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
