import { ScrollView, StyleSheet, Text, View, Alert, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';
import { animalsData } from '../data/animalsData';
import { animalsData } from '../data/reportsData';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getReports } from '../reducers/animals';
import { Ionicons } from '@expo/vector-icons';

export default function Reports() {
  // États des filtres
  const [filtre, setFiltre] = useState(false);

  // Priorité
  const [modere, setModere] = useState(false);
  const [important, setImportant] = useState(false);
  const [urgent, setUrgent] = useState(false);

  // Statut
  const [nouveaux, setNouveaux] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [clotures, setClotures] = useState(false);

  // Données filtrées affichées
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const reports = useSelector((state) => state.animals.value);
  const userRole = useSelector((state) => state.user.value.role);

  //Charge les données de base dans Redux au montage
  useEffect(() => {
    dispatch(getReports(animalsData));
  }, [dispatch]);

  // Effet qui applique TOUS les filtres combinés
  useEffect(() => {
    let result = [...reports];

    //Filtre PRIORITÉ
    if (modere) {
      result = result.filter((r) => r.priority === 'Modéré');
    }
    if (important) {
      result = result.filter((r) => r.priority === 'Important');
    }
    if (urgent) {
      result = result.filter((r) => r.priority === 'Urgent');
    }

    //Filtre STATUT
    // - "Nouveaux"    => status === 'nouveau'
    // - "En cours"    => status === 'en cours'
    // - "Clôturés"    => status === 'terminé'
    if (nouveaux) {
      result = result.filter((r) => r.status === 'nouveau');
    }
    if (enCours) {
      result = result.filter((r) => r.status === 'en cours');
    }
    if (clotures) {
      result = result.filter((r) => r.status === 'terminé');
    }

    setData(result);
  }, [
    reports,
    modere,
    important,
    urgent,
    nouveaux,
    enCours,
    clotures,
  ]);

  //Gestion des boutons "statut"
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

  //Gestion des filtres de priorité
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

  //Toggle ouverture / fermeture du menu Filtres
  const handleFiltre = () => {
    setFiltre((prev) => !prev);
  };

  // Exemple de handler pour une Card cliquée
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
        position: 'relative', // pour que l’overlay des filtres se base sur ce container
      }}
      className="bg-offwhite"
    >
      {/* Titre de la page */}
      <Text className="text-h1 font-manrope text-center mt-4">Signalements</Text>

      {/* Vue réservée aux agents : bouton Filtres */}
      {userRole === 'agent' && (
        <View className="flex-col items-center">
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
        {data.map((r, index) => (
          <Card key={index} {...r} onPress={handleClick} />
        ))}
        {/* Marge en bas pour éviter que le dernier élément soit collé à une éventuelle bottom bar */}
        <View style={{ marginBottom: 120 }} />
      </ScrollView>

      {/* Menu des filtres affiché en overlay au-dessus des cartes */}
      {filtre && (
        <View
          style={{
            position: 'absolute',
            top: 140,
            left: 0,
            right: 0,
            zIndex: 50,
            elevation: 50,
          }}
          className="items-center"
        >
          <View className="bg-white rounded-2xl border border-gray w-[350px] py-4 gap-4 shadow-lg">
            {/* Filtres de priorité */}
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

            {/* Filtres de statut */}
            <TouchableOpacity
              className={
                nouveaux
                  ? 'bg-deepSage h-12 w-[300px] rounded-2xl flex-col justify-center items-center self-center'
                  : 'bg-gray h-12 w-[300px] rounded-2xl flex-col justify-center items-center self-center'
              }
              onPress={() => {
                nouveauxPress();
                setFiltre(false);
              }}
            >
              <Text className={nouveaux ? 'text-white' : 'text-black'}>Nouveaux</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={
                enCours
                  ? 'bg-deepSage h-12 w-[300px] rounded-2xl flex-col justify-center items-center self-center'
                  : 'bg-gray h-12 w-[300px] rounded-2xl flex-col justify-center items-center self-center'
              }
              onPress={() => {
                enCoursPress();
                setFiltre(false);
              }}
            >
              <Text className={enCours ? 'text-white' : 'text-black'}>En cours</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={
                clotures
                  ? 'bg-deepSage h-12 w-[300px] rounded-2xl flex-col justify-center items-center self-center'
                  : 'bg-gray h-12 w-[300px] rounded-2xl flex-col justify-center items-center self-center'
              }
              onPress={() => {
                cloturesPress();
                setFiltre(false);
              }}
            >
              <Text className={clotures ? 'text-white' : 'text-black'}>Clôturés</Text>
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