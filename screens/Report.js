import { ScrollView, StyleSheet, Text, View, Alert, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';
import { reportsData } from '../data/reportsData';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getReports } from '../reducers/animals';
import { Ionicons } from '@expo/vector-icons';

export default function Reports() {
  const [admin, setAdmin] = useState(false);
  const [nouveaux, setNouveaux] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [clotures, setClotures] = useState(false);
  const [filtre, setFiltre] = useState(false);
  const [modere, setModere] = useState(false);
  const [important, setImportant] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const reports = useSelector((state) => state.animals.value);

  const userRole = useSelector((state) => state.user.value.role);

  const url = process.env.EXPO_PUBLIC_BACKEND

  let cartes = []

  let adminView = '';
  useEffect(() => {
    dispatch(getReports(reportsData));
  }, []);

  useEffect(() => {
    console.log(userRole);
  }, []);

  // Effet qui met à jour les données affichées en fonction des filtres de priorité
  useEffect(() => {
    if (modere) {
      const filtrer = reports.filter((r) => r.priority === 'Modéré');
      setData(filtrer);
    } else if (important) {
      const filtrer = reports.filter((r) => r.priority === 'Important');
      setData(filtrer);
    } else if (urgent) {
      const filtrer = reports.filter((r) => r.priority === 'Urgent');
      setData(filtrer);
    } else {
      // Si aucun filtre de priorité n'est activé, on affiche tous les reports
      setData(reports);
    }
  }, [modere, important, urgent, reports]);

  // Gestion des boutons "Nouveaux / En cours / Clôturés"
  // Pour l'instant ils ne filtrent pas encore les données, mais ils modifient bien l'état visuel
  const nouveauxPress = () => {
    setNouveaux((prev) => !prev);
    setEnCours(false);
    setClotures(false);
  };

  const enCoursPress = () => {
    setEnCours((prev) => !prev);
    setNouveaux(false);
    setClotures(false);
  };

  const cloturesPress = () => {
    setClotures((prev) => !prev);
    setNouveaux(false);
    setEnCours(false);
  };

  // Toggle d’ouverture / fermeture du menu des filtres
  const handleFiltre = () => {
    setFiltre((prev) => !prev);
  };

  // Handlers des filtres de priorité
  // Ici on ne permet qu'un seul filtre actif à la fois
  const handleModere = () => {
    setModere((prev) => !prev);
    setImportant(false);
    setUrgent(false);
  };

  const handleImportant = () => {
    setImportant((prev) => !prev);
    setModere(false);
    setUrgent(false);
  };

  const handleUrgent = () => {
    setUrgent((prev) => !prev);
    setModere(false);
    setImportant(false);
  };

  // Exemple de handler pour une Card cliquée (popup d’alerte)
  const handleClick = () => {
    Alert.alert(
      'Card pressed',
      'This will open full screen modal with all infos of this report',
      [
        { text: 'Cancel', style: 'destructive', onPress: () => Alert.alert('Cancel Pressed') },
        { text: 'Understood', onPress: () => console.log('OK') },
      ]
    );
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        position: 'relative', // important pour que l’overlay des filtres se base sur ce container
      }}
      className="bg-offwhite"
    >
      {/* Titre de la page */}
      <Text className="text-h1 font-manrope text-center mt-4">Signalements</Text>

      {/* Vue réservée aux agents : boutons de statut + bouton Filtres */}
      {userRole === 'agent' && (
        <View className="flex-col items-center">
          {/* Boutons Nouveaux / En cours / Clôturés */}
          <View className="flex-row gap-4 p-4">
            <TouchableOpacity
              className={
                nouveaux
                  ? 'flex-col items-center justify-center bg-deepSage rounded-2xl w-[110px] h-12'
                  : 'flex-col items-center justify-center bg-gray rounded-2xl w-[110px] h-12'
              }
              onPress={nouveauxPress}
            >
              <Text className={nouveaux ? 'text-white text-2xl' : 'text-black text-2xl'}>
                Nouveaux
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={
                enCours
                  ? 'flex-col items-center justify-center bg-deepSage rounded-2xl w-[110px] h-12'
                  : 'flex-col items-center justify-center bg-gray rounded-2xl w-[110px] h-12'
              }
              onPress={enCoursPress}
            >
              <Text className={enCours ? 'text-white text-2xl' : 'text-black text-2xl'}>
                En cours
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={
                clotures
                  ? 'flex-col items-center justify-center bg-deepSage rounded-2xl w-[110px] h-12'
                  : 'flex-col items-center justify-center bg-gray rounded-2xl w-[110px] h-12'
              }
              onPress={cloturesPress}
            >
              <Text className={clotures ? 'text-white text-2xl' : 'text-black text-2xl'}>
                Cloturés
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bouton Filtres (ouvre le menu déroulant en overlay) */}
          <View className="mt-2 w-[350px]">
            <TouchableOpacity
              className="border border-gray rounded-2xl h-12 w-full flex-row items-center justify-between px-4"
              onPress={handleFiltre}
            >
              <Text>Filtres</Text>
              <Ionicons name="chevron-down-outline" color="#000000" size={20} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Liste des signalements sous forme de cartes */}
      <ScrollView style={{ flex: 1, width: '100%' }}>
        {data.map((r) => (
          <Card key={r.id} {...r} onPress={handleClick} />
        ))}
        {/* Marge en bas pour éviter que le dernier élément soit collé à la bottom bar éventuelle */}
        <View style={{ marginBottom: 120 }} />
      </ScrollView>

      {/* Menu des filtres affiché en overlay au-dessus des cartes */}
      {filtre && (
        <View
          style={{
            position: 'absolute',
            top: 140, // à ajuster pour l’aligner visuellement sous le bouton "Filtres"
            left: 0,
            right: 0,
            zIndex: 50,
            elevation: 50, // nécessaire sur Android pour que le zIndex soit pris en compte
          }}
          className="items-center"
        >
          <View className="bg-white rounded-2xl border border-gray w-[350px] py-4 gap-4 shadow-lg">
            <TouchableOpacity
              className={
                modere
                  ? 'bg-deepSage h-12 w-[300px] rounded-2xl flex-col justify-center items-center self-center'
                  : 'bg-gray h-12 w-[300px] rounded-2xl flex-col justify-center items-center self-center'
              }
              onPress={() => {
                handleModere();
                setFiltre(false);
              }}
            >
              <Text className={modere ? 'text-white' : 'text-black'}>Modéré</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={
                important
                  ? 'bg-deepSage h-12 w-[300px] rounded-2xl flex-col justify-center items-center self-center'
                  : 'bg-gray h-12 w-[300px] rounded-2xl flex-col justify-center items-center self-center'
              }
              onPress={() => {
                handleImportant();
                setFiltre(false);
              }}
            >
              <Text className={important ? 'text-white' : 'text-black'}>Important</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={
                urgent
                  ? 'bg-deepSage h-12 w-[300px] rounded-2xl flex-col justify-center items-center self-center'
                  : 'bg-gray h-12 w-[300px] rounded-2xl flex-col justify-center items-center self-center'
              }
              onPress={() => {
                handleUrgent();
                setFiltre(false);
              }}
            >
              <Text className={urgent ? 'text-white' : 'text-black'}>Urgent</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray h-10 w-[200px] rounded-2xl flex-col justify-center items-center self-center mt-2"
              onPress={() => setFiltre(false)}
            >
              <Text className="text-white text-lg">Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
