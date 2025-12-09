import { ScrollView, StyleSheet, Text, View, Alert, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';
import { reportsData } from '../data/reportsData';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getReports } from '../reducers/animals';
import { Ionicons } from '@expo/vector-icons/Ionicons';

export default function Reports() {
  const [admin, setAdmin] = useState(false);
  const [nouveaux, setNouveaux] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [clotures, setClotures] = useState(false);
  const [filtre, setFiltre] = useState(false);

  const dispatch = useDispatch();
  const reports = useSelector((state) => state.animals.value);

  // const userRole = useSelector((state) => state.user.value.role);
  const userRole = 'agent';

  useEffect(() => {
    dispatch(getReports(reportsData));
  }, []);

  useEffect(() => {
    console.log(userRole);
  }, []);

  const adminDisplay = () => {
    if (userRole === 'agent') {
      return (
        <SafeAreaView
          edges={['top']}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className='bg-offwhite'
        >
          <Text className='text-h1 font-manrope'>Signalements admin</Text>
          <ScrollView style={{ flex: 1, width: '100%' }}>
            {reports.map((r) => (
              <Card key={r.id} {...r} />
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
  };

  const nouveauxPress = () => {
    setNouveaux(true);
    setEnCours(false);
    setClotures(false);
  };

  const enCoursPress = () => {
    setEnCours(true);
    setNouveaux(false);
    setClotures(false);
  };

  const cloturesPress = () => {
    setClotures(true);
    setNouveaux(false);
    setEnCours(false);
  };

  const handleFiltre = () => {
    setFiltre(true);
  };
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
      className='bg-offwhite'
    >
      <Text className='text-h1 font-manrope'>Signalements</Text>
      <View className='flex-row gap-4 p-4'>
        <TouchableOpacity
          className={
            nouveaux
              ? 'flex-col justify-center items-center bg-deepSage rounded-2xl w-[110px] h-12'
              : 'flex-col justify-center items-center bg-gray rounded-2xl w-[110px] h-12'
          }
          onPress={() => nouveauxPress()}
        >
          <Text className={nouveaux ? 'text-white text-2xl' : 'text-black text-2xl'}>Nouveaux</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={
            enCours
              ? 'flex-col justify-center items-center bg-deepSage rounded-2xl w-[110px] h-12'
              : 'flex-col justify-center items-center bg-gray rounded-2xl w-[110px] h-12'
          }
          onPress={() => enCoursPress()}
        >
          <Text className={enCours ? 'text-white text-2xl' : 'text-black text-2xl'}>En cours</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={
            clotures
              ? 'flex-col justify-center items-center bg-deepSage rounded-2xl w-[110px] h-12'
              : 'flex-col justify-center items-center bg-gray rounded-2xl w-[110px] h-12'
          }
          onPress={() => cloturesPress()}
        >
          <Text className={clotures ? 'text-white text-2xl' : 'text-black text-2xl'}>Cloturés</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          className='border h-12 w-[350] flex-col justify-center '
          onPress={() => handleFiltre()}
        >
          <Text>Filtre</Text>
        </TouchableOpacity>
        <Modal
          className='pb-8'
          animationType='slide'
          visible={filtre}
          presentationStyle='formSheet'
          onRequestClose={() => setFiltre(!filtre)}
        >
          <View>
            <TouchableOpacity>
              <Text>Filtre</Text>
              <Ionicons name='chevron-down-outline' color='#000000' size={20}></Ionicons>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
      <ScrollView style={{ flex: 1, width: '100%' }}>
        {reports.map((r) => (
          <Card key={r.id} {...r} />
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

const styles = StyleSheet.create({});
