import { View } from 'react-native';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import useTheme from '../hooks/useTheme';
import usePostReport from '../hooks/usePostReport';
import Button from '../components/shared/Button';
import Input from '../components/shared/Input';
import AppText from '../components/shared/AppText';
import HeaderBackHelp from '../components/reportScreen/HeaderBackHelp';
import AnimalTypeSelector from '../components/reportScreen/AnimalTypeSelector';
import CameraPreviewButton from '../components/reportScreen/CameraPreviewButton';
import StatusCheckboxes from '../components/reportScreen/StatusCheckboxes';
import ReportTextFields from '../components/reportScreen/ReportTextFields';
import ConfirmSubmitModal from '../components/reportScreen/ConfirmSubmitModal';

export default function ReportScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const user = useSelector(state => state.user.value);
  const { colors } = useTheme();
  const { submit, openConfirmIfValid, status, error, fieldErrors, reset } = usePostReport(
    user.token,
  );

  const currentLocation = route.params?.currentLocation || null;
  const photoURI = route.params?.photoURI || null;

  const [animalType, setAnimalType] = useState('chat');
  const [animalState, setAnimalState] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const openCamera = () => {
    navigation.navigate('Camera', { currentLocation });
  };

  const toggleState = (state, checked) => {
    setAnimalState(prevState =>
      checked ? [...prevState, state] : prevState.filter(s => s !== state),
    );
  };

  const getReportForm = () => ({
    title,
    description,
    animalType,
    animalState,
    currentLocation,
    photoURI,
  });

  const handleSubmit = async () => {
    await submit(getReportForm());
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={{ paddingTop: 42, alignItems: 'center' }}
      style={{ flex: 1, backgroundColor: colors.offwhite }}>
      {/* HEADER BOUTONS RETOUR ET INFOS */}
      <HeaderBackHelp
        onPressBack={() => navigation.goBack()}
        onPressInfo={() => console.log('info btn')}
      />

      <AppText className='text-h3 text-deepSage my-2 font-manrope-bold'>
        Envoyer un signalement
      </AppText>

      {/* ERROR PLACEHOLDER */}
      {Object.entries(fieldErrors).length > 0 && (
        <AppText className='text-error mb-2 font-semibold text-body'>
          {Object.values(fieldErrors)[0]}
        </AppText>
      )}

      <Input
        label='Ma position'
        icon='location'
        placeholder='Ma position'
        editable={false}
        defaultValue={
          (currentLocation?.latitude?.toFixed(3) ?? 'N/A') +
          '  ' +
          (currentLocation?.longitude?.toFixed(3) ?? 'N/A')
        }
      />

      {/* RADIO BOUTONS POUR SELECTION DE L'ANIMAL */}
      <AnimalTypeSelector animalType={animalType} setAnimalType={setAnimalType} />

      {/* Affichage miniature de la photo prise */}
      <CameraPreviewButton photoURI={photoURI} onOpenCamera={openCamera} />

      {/* CHECKBOXES ETAT DE SANTE ET COMPORTEMENT */}
      <StatusCheckboxes animalState={animalState} onToggle={toggleState} />

      {/* TITRE ET DESCRIPTION */}
      <ReportTextFields
        title={title}
        onChangeTitle={title => setTitle(title)}
        description={description}
        onChangeDescription={description => setDescription(description)}
      />

      {/* BOUTON ENVOI SIGNALEMENT */}
      <Button
        title={status === 'submitting' ? 'Chargement' : 'Envoyer le signalement'}
        onPress={() => openConfirmIfValid(getReportForm())}
        bg={status === 'submitting' && 'lightgray'}
      />
      <View className='h-14' />

      {/* MODAL DE CONFIRMATION D'ENVOI */}
      <ConfirmSubmitModal
        visible={status !== 'idle'}
        status={status}
        onConfirm={handleSubmit}
        onClose={reset}
        onSuccess={() => {
          reset();
          navigation.navigate('Map');
        }}
        error={error}
      />
    </KeyboardAwareScrollView>
  );
}
