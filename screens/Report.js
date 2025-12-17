import { ScrollView, Text, View, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';
import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReports } from '../reducers/animals';
import { Ionicons } from '@expo/vector-icons';
import ReportDetailAgent from '../components/module/ReportDetailAgent';
import * as Location from 'expo-location';
import { getDistanceBetweenTwoPoints } from '../helpers/getDistance';


const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND;

export default function Reports() {
  const dispatch = useDispatch();

  const reports = useSelector((state) => state.animals.value) || []; //add security for undefined
  const userRole = useSelector((state) => state.user.value.role);
  const user = useSelector((state) => state.user.value);
  const userId =
    user?._id || user?.id || user?.userId || user?.uid || user?.user?._id || user?.user?.id || null;

  /* -------------------- UI STATES -------------------- */
  const [filtre, setFiltre] = useState(false);

  //Filtres en LISTES (multi)
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [dataReport, setDataReport] = useState(null);

  // Description agent
  const [description, setDescription] = useState('');

  // Position user
  const [currentLocation, setCurrentLocation] = useState({ latitude: 0, longitude: 0 });

  /*const nouveauxPress = () => {
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

  };
  */
  //function pour récupérer la description et le statut pour l'envoyer en base de donnée
  // TODO -> A deplacer dans la modal je pense
  const handleActualiser = ({ description, cours, cloturer }) => {
    const status = cours ? 'en cours' : cloturer ? 'terminé' : null;
    if (!status || !dataReport) return;
    console.log('ENVOYÉ AU BACKEND =>', { status, description });
    fetch(`${BACKEND_URL}/animals/${dataReport._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`, //JWT token
      },
      body: JSON.stringify({
        status,
        description,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('PUT /animals/:id response =>', json); //debug

        if (json.result) {
          //recharge les signalements
          fetch(`${BACKEND_URL}/animals`)
            .then((res) => res.json())
            .then((data) => {
            //  console.log('data', data);
            //  console.log('data.reports', data.reports);

              if (data.result) dispatch(getReports(data.reports));
            });
          setModalVisible(false);
          setDescription('');
          }
        })
        .catch((err) => {
          console.error('PUT/animals Erreur lors de la mise à jour du signalement =>', err);
        });
  };  

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, url]);

  /* -------------------- GEOLOCATION -------------------- */
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission refusée pour accéder à la localisation');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  /* -------------------- LISTE FILTRÉE -------------------- */
  const filteredList = useMemo(() => {
    let result = [...reports];

    // PRIORITÉS
    if (selectedPriorities.length > 0) {
      result = result.filter((r) => selectedPriorities.includes(r?.priority));
    }

    // STATUTS
    if (selectedStatuses.length > 0) {
      result = result.filter((r) => selectedStatuses.includes(r?.status));
    }

    return result;
  }, [reports, selectedPriorities, selectedStatuses]);

  /* -------------------- MODAL -------------------- */
  const handleClick = (report) => {
    setDataReport(report);
    setModalVisible(true);
  };

  /* -------------------- DATA FILTRES -------------------- */
  const PRIORITIES = [
    { label: 'Modéré', value: 'modere' },
    { label: 'Important', value: 'important' },
    { label: 'Urgent', value: 'urgent' },
  ];

  const STATUSES = [
    { label: 'Nouveaux', value: 'nouveau' },
    { label: 'En cours', value: 'en cours' },
    { label: 'Clôturés', value: 'terminé' },
  ];

  const renderFilterButton = ({ label, value }, selectedList, onToggle) => {
    const isSelected = selectedList.includes(value);

    return (
      <TouchableOpacity
        key={value}
        className={
          isSelected
            ? 'bg-deepSage h-12 w-[300px] rounded-2xl justify-center items-center self-center'
            : 'bg-gray h-12 w-[300px] rounded-2xl justify-center items-center self-center'
        }
        onPress={() => onToggle(value)}
      >
        <Text className={isSelected ? 'text-white' : 'text-black'}>{label}</Text>
      </TouchableOpacity>
    );
  };

  /* -------------------- UI -------------------- */
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, position: 'relative' }} className='bg-offwhite'>
      <Text className='text-h1 font-manrope text-center mt-4'>Signalements</Text>

      {/* Bouton Filtres (agents uniquement) */}
      {userRole === 'agent' && (
        <View className='flex-col items-center'>
          <View className='mt-2 w-[350px]'>
            <TouchableOpacity
              className='border border-gray rounded-2xl h-12 w-full flex-row items-center justify-between px-4'
              onPress={() => setFiltre((prev) => !prev)}
            >
              <Text>Filtres</Text>
              <Ionicons name='chevron-down-outline' color='#000000' size={20} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Cartes */}
      <ScrollView style={{ flex: 1, width: '100%' }}>
        {filteredList.map((r) => (
          <Card
            key={r?._id}
            {...r}
            place={getDistanceBetweenTwoPoints(
              { latitude: r.location?.lat, longitude: r.location?.long },
              currentLocation
            )}
            onPress={() => handleClick(r)}
          />
        ))}
        <View style={{ marginBottom: 120 }} />
      </ScrollView>

      {/* Modal détail */}
      <ReportDetailAgent
        visible={modalVisible}
        onClose={closeModal}
        report={dataReport}
        agent={userRole}
        description={description}
        onChangeDescription={setDescription}
        onActualiser={handleActualiser}
      />

      {/* Overlay filtres */}
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
          className='items-center'
        >
          <View className='bg-white rounded-2xl border border-gray w-[350px] py-4 gap-4 shadow-lg'>
            {/* Priorités */}
            {PRIORITIES.map((item) => renderFilterButton(item, selectedPriorities, togglePriority))}

            {/* Statuts */}
            {STATUSES.map((item) => renderFilterButton(item, selectedStatuses, toggleStatus))}

            {/* Reset */}
            <TouchableOpacity
              className='bg-gray h-10 w-[200px] rounded-2xl justify-center items-center self-center mt-2'
              onPress={() => {
                setSelectedPriorities([]);
                setSelectedStatuses([]);
                setFiltre(false);
              }}
            >
              <Text className='text-white text-lg'>Réinitialiser</Text>
            </TouchableOpacity>

            {/* Fermer */}
            <TouchableOpacity
              className='bg-gray h-10 w-[200px] rounded-2xl justify-center items-center self-center'
              onPress={() => setFiltre(false)}
            >
              <Text className='text-white text-lg'>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
