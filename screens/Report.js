import { ScrollView, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);
  // Backend
  const url = process.env.EXPO_PUBLIC_BACKEND;

  /* -------------------- REDUX -------------------- */
  const reports = useSelector(state => state.animals?.value) ?? [];
  const user = useSelector(state => state.user?.value) ?? {};
  const userRole = user?.role ?? null;

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

  /* -------------------- HELPERS filtres -------------------- */
  const togglePriority = value => {
    setSelectedPriorities(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const toggleStatus = value => {
    setSelectedStatuses(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setDataReport(null);
    setDescription('');
  };

  /* -------------------- FETCH REPORTS -------------------- */
  const fetchReports = () => {
    if (!url) {
      console.log('EXPO_PUBLIC_BACKEND manquant');
      return;
    }
    setRefreshing(true);
    fetch(`${url}/animals/agent`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(json => {
        const list =
          (Array.isArray(json?.reports) && json.reports) ||
          (Array.isArray(json?.data) && json.data) ||
          [];
        dispatch(getReports(list));
        setRefreshing(false);
      })
      .catch(err => {
        console.log('Erreur GET /animals', err);
        dispatch(getReports([]));
      });
  };

  // useEffect(() => {
  //   fetchReports();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [dispatch, url]);

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
      result = result.filter(r => selectedPriorities.includes(r?.priority));
    }

    // STATUTS
    if (selectedStatuses.length > 0) {
      result = result.filter(r => selectedStatuses.includes(r?.status));
    }

    return result;
  }, [reports, selectedPriorities, selectedStatuses]);

  /* -------------------- MODAL -------------------- */
  const handleClick = report => {
    setDataReport(report);
    setModalVisible(true);
  };

  const handleActualiser = ({ description, cours, cloturer }) => {
    const status = cours ? 'en cours' : cloturer ? 'terminé' : null;
    if (!status) {
      Alert.alert('Statut manquant', 'Choisis "En cours" ou "Clôturer" avant d’actualiser.');
      return;
    }
    if (!url) {
      Alert.alert('Erreur', 'Backend non configuré (EXPO_PUBLIC_BACKEND manquant).');
      return;
    }
    if (!dataReport?._id) {
      Alert.alert('Erreur', "Impossible d'identifier le signalement.");
      return;
    }
    if (userRole === 'agent' && !userId) {
      Alert.alert('Utilisateur non identifié', 'Reconnecte-toi (userId manquant).');
      return;
    }

    fetch(`${url}/animals/${dataReport._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ status, description, establishment: user.establishment }),
    })
      .then(async res => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          Alert.alert('Erreur', json?.error || json?.message || `Erreur ${res.status}`);
          return null;
        }
        return json;
      })
      .then(json => {
        if (!json) return;

        if (json.result) {
          fetchReports();
          closeModal();
        } else {
          Alert.alert('Erreur', json?.error || json?.message || "Impossible d'actualiser.");
        }
      })
      .catch(err => {
        console.log('Erreur PUT /animals/:id', err);
        Alert.alert('Erreur réseau', "La mise à jour n'a pas pu être envoyée.");
      });
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
            ? 'bg-deepSage h-12 w-10/12 rounded-2xl justify-center items-center self-center'
            : 'bg-gray h-12 w-10/12 rounded-2xl justify-center items-center self-center'
        }
        onPress={() => onToggle(value)}>
        <Text className={isSelected ? 'text-white' : 'text-black'}>{label}</Text>
      </TouchableOpacity>
    );
  };

  /* -------------------- UI -------------------- */
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, position: 'relative' }} className='bg-offwhite'>
      <Text className='text-h2 font-manrope text-deepSage text-center mt-4'>Signalements</Text>

      {/* Bouton Filtres (agents uniquement) */}
      {userRole === 'agent' && (
        <View className='flex-col items-center'>
          <View className='mt-2 w-9/12'>
            <TouchableOpacity
              className='border border-gray rounded-2xl h-12 w-full flex-row items-center justify-between px-4'
              onPress={() => setFiltre(prev => !prev)}>
              <Text>Filtres</Text>
              <Ionicons
                name={filtre ? 'chevron-up-outline' : 'chevron-down-outline'}
                color='#000000'
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Liste des signalements sous forme de cartes FlatList fonctionne comme Scrollview + .map en optimisant les performances : Ce qui n'est pas affiché est ignoré */}
      <View style={{ flex: 1, width: '100%' }}>
        <FlatList
          data={filteredList}
          refreshing={user.role === 'agent' ? refreshing : false}
          onRefresh={user.role === 'agent' ? fetchReports : null}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <Card
              {...item}
              place={getDistanceBetweenTwoPoints(
                { latitude: item.location.lat, longitude: item.location.long },
                currentLocation
              )}
              onPress={() => handleClick(item)}
            />
          )}
          ListFooterComponent={<View style={{ marginBottom: 120 }} />}
          // Marge en bas pour éviter que le dernier élément soit collé à une éventuelle bottom bar
        />
      </View>

      {/* Modal détail */}
      <ReportDetailAgent
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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
            top: 170,
            left: 0,
            right: 0,
            zIndex: 50,
            elevation: 50,
          }}
          className='items-center'>
          <View className='bg-white rounded-2xl border border-gray w-9/12 py-4 gap-4 shadow-lg'>
            {/* Priorités */}
            {PRIORITIES.map(item => renderFilterButton(item, selectedPriorities, togglePriority))}

            {/* Statuts */}
            {STATUSES.map(item => renderFilterButton(item, selectedStatuses, toggleStatus))}

            {/* Reset */}
            <TouchableOpacity
              className='bg-gray h-10 w-1/2 rounded-2xl justify-center items-center self-center mt-2'
              onPress={() => {
                setSelectedPriorities([]);
                setSelectedStatuses([]);
                setFiltre(false);
              }}>
              <Text className='text-text text-lg'>Réinitialiser</Text>
            </TouchableOpacity>

            {/* Fermer */}
            <TouchableOpacity
              className='bg-gray h-10 w-1/2 rounded-2xl justify-center items-center self-center'
              onPress={() => setFiltre(false)}>
              <Text className='text-text text-lg'>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
