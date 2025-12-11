import { ScrollView, StyleSheet, Text, View, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';
import CustomModal from '../components/ui/CustomModal';
import { reportsData } from '../data/reportsData';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReports } from '../reducers/animals';

export default function Reports() {
  const dispatch = useDispatch();

  // take reports from redux
  const reports = useSelector((state) => state.animals.value);

  //Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [dataReport, setDataReport] = useState(null);

  // fetch reports from data (local file) and store them in redux
  useEffect(() => {
    dispatch(getReports(reportsData));
  }, []);

  //show details of a report in a modal
  const handleClick = (report) => {
    setDataReport(report);
    setModalVisible(true);

    /*Alert.alert('Card pressed', 'This will open full screen modal with all infos of this report', [
      { text: 'Cancel', style: 'destructive', onPress: () => Alert.alert('Cancel Pressed') },
      { text: 'Understood', onPress: () => console.log('OK') },
    ]);
    */
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
      <ScrollView style={{ flex: 1, width: '100%' }}>
        {/* Map throught reports and add function */}
        {reports.map((r) => (
          <Card key={r.id} {...r} onPress={() => handleClick(r)} />
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

      {/* Modal for report details */}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        //title={dataReport ? '' : 'Détails du signalement'}
        content={
          dataReport ? (
            <View>
              <View className='w-full aspect-[4/3] mb-4'>
                <Image
                  source={{ uri: dataReport.photoUrl }}
                  className='w-full h-full rounded-2xl object-cover'
                />
              </View>

              <Text className='text-xl font-bold mb-2 text-left'>{dataReport.title}</Text>

              <View className='w-full flex-row justify-between mb-3'>
                <Text>{dataReport.place}</Text>
                <Text>{dataReport.date}</Text>
              </View>

              <View className="bg-deepSage/20 border border-deepSage rounded-2xl px-3 py-1 self-start mb-4">
                <Text>{dataReport.priority}</Text>
              </View>

              <View>
                <Text className='text-base text-gray-800 leading-5'
                style={{ textAlign: 'justify' }}>{dataReport.description}
                </Text>
              </View>
            </View>
          ) : (
            <Text>Aucun détail disponible.</Text>
          )
        }
        //fullscreen={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
