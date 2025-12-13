import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../components/ui/Card';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getReports } from '../reducers/animals';
import { Ionicons } from '@expo/vector-icons';
import ReportDetail from '../components/module/ReportDetailAgent';

export default function Reports() {
  const dispatch = useDispatch();
  const url = process.env.EXPO_PUBLIC_BACKEND;

  /* -------------------- REDUX (SAFE) -------------------- */
  const reports = useSelector((state) => state.animals?.value) ?? [];
  const user = useSelector((state) => state.user?.value) ?? {};

  const userRole = user?.role ?? null;

  // ✅ userId robuste (selon la forme que votre backend renvoie)
  const userId =
    user?._id || user?.id || user?.userId || user?.uid || user?.user?._id || user?.user?.id || null;

  /* -------------------- UI STATES -------------------- */
  const [filtre, setFiltre] = useState(false);

  // Priorité (exclusive)
  const [modere, setModere] = useState(false);
  const [important, setImportant] = useState(false);
  const [urgent, setUrgent] = useState(false);

  // Statut (exclusive)
  const [nouveaux, setNouveaux] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [clotures, setClotures] = useState(false);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [dataReport, setDataReport] = useState(null);

  // Description agent
  const [description, setDescription] = useState('');

  /* -------------------- API -------------------- */
  const fetchReports = useCallback(() => {
    if (!url) {
      console.log('EXPO_PUBLIC_BACKEND manquant');
      return;
    }

    fetch(`${url}/animals`)
      .then((res) => res.json())
      .then((json) => {
        // Supporte plusieurs formats backend possibles
        const list =
          (Array.isArray(json?.reports) && json.reports) ||
          (Array.isArray(json?.data) && json.data) ||
          (Array.isArray(json?.data?.data) && json.data.data) ||
          [];

        if (json?.result === true || Array.isArray(list)) {
          dispatch(getReports(list));
        } else {
          console.log('Erreur API / format inattendu:', json);
          dispatch(getReports([]));
        }
      })
      .catch((err) => {
        console.log('Erreur fetch /animals:', err);
        dispatch(getReports([]));
      });
  }, [dispatch, url]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  /* -------------------- FILTERS -------------------- */
  const filteredData = useMemo(() => {
    let result = [...(reports ?? [])];

    // PRIORITÉ
    if (modere) result = result.filter((r) => r?.priority === 'modere');
    if (important) result = result.filter((r) => r?.priority === 'important');
    if (urgent) result = result.filter((r) => r?.priority === 'urgent');

    // STATUT
    if (nouveaux) result = result.filter((r) => r?.status === 'nouveau');
    if (enCours) result = result.filter((r) => r?.status === 'en cours');
    if (clotures) result = result.filter((r) => r?.status === 'terminé');

    return result;
  }, [reports, modere, important, urgent, nouveaux, enCours, clotures]);

  /* -------------------- FILTER BUTTONS -------------------- */
  const handleFiltre = () => setFiltre((prev) => !prev);

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

  /* -------------------- MODAL -------------------- */
  const openModal = (report) => {
    setDataReport(report);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setDataReport(null);
    setDescription('');
  };

  const handleActualiser = ({ description, cours, cloturer }) => {
    // ✅ 1) Statut obligatoire
    if (!cours && !cloturer) {
      Alert.alert('Statut manquant', 'Choisis "En cours" ou "Clôturer" avant d’actualiser.');
      return;
    }

    // ✅ 2) Vérifs
    if (!dataReport?._id) {
      Alert.alert('Erreur', 'Impossible d’identifier le signalement.');
      return;
    }

    // ✅ 3) Si agent, userId obligatoire
    if (userRole === 'agent' && !userId) {
      Alert.alert(
        'Utilisateur non identifié',
        "Ton compte n'a pas d'identifiant dans Redux. Reconnecte-toi ou vérifie le reducer user."
      );
      return;
    }

    if (!url) {
      Alert.alert('Erreur', 'Backend non configuré (EXPO_PUBLIC_BACKEND manquant).');
      return;
    }

    const status = cours ? 'en cours' : 'terminé';

    fetch(`${url}/animals/${dataReport._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        description,
        userId, // backend actuel attend ça chez toi
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('PUT /animals/:id =>', json);

        if (json?.result) {
          fetchReports();
          closeModal();
        } else {
          Alert.alert('Erreur', json?.error || json?.message || "Impossible d'actualiser.");
        }
      })
      .catch((err) => {
        console.log('Erreur PUT /animals/:id', err);
        Alert.alert('Erreur réseau', "La mise à jour n'a pas pu être envoyée.");
      });
  };

  /* -------------------- UI -------------------- */
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, position: 'relative' }} className='bg-offwhite'>
      <Text className='text-h1 font-manrope text-center mt-4'>Signalements</Text>

      {userRole === 'agent' && (
        <View className='flex-col items-center'>
          <View className='mt-2 w-[350px]'>
            <TouchableOpacity
              className='border border-gray rounded-2xl h-12 w-full flex-row items-center justify-between px-4'
              onPress={handleFiltre}
            >
              <Text>Filtres</Text>
              <Ionicons name='chevron-down-outline' color='#000000' size={20} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={{ flex: 1, width: '100%' }}>
        {(filteredData ?? []).map((r, index) => (
          <Card key={r?._id ?? index} {...r} onPress={() => openModal(r)} />
        ))}
        <View style={{ marginBottom: 120 }} />
      </ScrollView>

      <ReportDetail
        visible={modalVisible}
        onClose={closeModal}
        report={dataReport}
        agent={userRole}
        description={description}
        onChangeDescription={setDescription}
        onActualiser={handleActualiser}
      />

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
            <TouchableOpacity
              className={
                modere
                  ? 'bg-deepSage h-12 w-[300px] rounded-2xl justify-center items-center self-center'
                  : 'bg-gray h-12 w-[300px] rounded-2xl justify-center items-center self-center'
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
                  ? 'bg-deepSage h-12 w-[300px] rounded-2xl justify-center items-center self-center'
                  : 'bg-gray h-12 w-[300px] rounded-2xl justify-center items-center self-center'
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
                  ? 'bg-deepSage h-12 w-[300px] rounded-2xl justify-center items-center self-center'
                  : 'bg-gray h-12 w-[300px] rounded-2xl justify-center items-center self-center'
              }
              onPress={() => {
                handleUrgent();
                setFiltre(false);
              }}
            >
              <Text className={urgent ? 'text-white' : 'text-black'}>Urgent</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={
                nouveaux
                  ? 'bg-deepSage h-12 w-[300px] rounded-2xl justify-center items-center self-center'
                  : 'bg-gray h-12 w-[300px] rounded-2xl justify-center items-center self-center'
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
                  ? 'bg-deepSage h-12 w-[300px] rounded-2xl justify-center items-center self-center'
                  : 'bg-gray h-12 w-[300px] rounded-2xl justify-center items-center self-center'
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
                  ? 'bg-deepSage h-12 w-[300px] rounded-2xl justify-center items-center self-center'
                  : 'bg-gray h-12 w-[300px] rounded-2xl justify-center items-center self-center'
              }
              onPress={() => {
                cloturesPress();
                setFiltre(false);
              }}
            >
              <Text className={clotures ? 'text-white' : 'text-black'}>Clôturés</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className='bg-gray h-10 w-[200px] rounded-2xl justify-center items-center self-center mt-2'
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
