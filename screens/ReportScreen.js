import { Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import CustomModal from '../components/ui/CustomModal';
import SplashScreen from '../components/SplashScreen';
import useTheme from '../hooks/useTheme';
import { AdvancedCheckbox } from 'react-native-advanced-checkbox';
import { useSelector } from 'react-redux';
import { addReport } from '../reducers/animals';
import { useDispatch } from 'react-redux';
import * as animalAPI from '../api/animals.api';
import * as uploadAPI from '../api/upload.api';

export default function ReportScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.value);
  const { colors } = useTheme();

  const currentLocation = route.params?.currentLocation || null;

  const [animalType, setAnimalType] = useState('chat');
  const [photoUri, setPhotoUri] = useState(null);
  const [animalState, setAnimalState] = useState([]);
  const [reportTitle, setReportTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  const openCamera = () => {
    navigation.navigate('Camera', {
      onPhotoTaken: uri => {
        setPhotoUri(uri);
      },
    });
  };

  const toggleState = (state, checked) => {
    setAnimalState(prevState =>
      checked ? [...prevState, state] : prevState.filter(s => s !== state),
    );
  };

  // Verifie que tous les champs sont remplis avant envoi
  const handleSubmit = () => {
    if (isLoading) return;
    setIsLoading(true);

    // Simple validation
    if (!animalType) {
      setFormError("Veuillez sélectionner un type d'animal.");
      setIsLoading(false);
      return;
    }
    if (!reportTitle.trim()) {
      setFormError('Veuillez entrer un titre pour le signalement.');
      setIsLoading(false);
      return;
    }
    if (!description.trim()) {
      setFormError('Veuillez entrer une description pour le signalement.');
      setIsLoading(false);
      return;
    }
    if (!photoUri) {
      setFormError("Veuillez prendre une photo de l'animal.");
      setIsLoading(false);
      return;
    }
    if (!currentLocation.latitude || !currentLocation.longitude) {
      setFormError('La localisation est requise pour le signalement.');
      setIsLoading(false);
      return;
    }
    // Tout est bon
    setFormError(null);
    return true;
  };

  // Envoi du signalement au backend
  const sendReport = async () => {
    setShowLoader(true);

    const reportPayload = {
      location: {
        lat: currentLocation.latitude,
        long: currentLocation.longitude,
      },
      animalType,
      state: animalState,
      title: reportTitle,
      desc: description,
    };

    const photoData = new FormData();
    photoData.append('file', {
      uri: photoUri,
      name: 'report_photo.jpg',
      type: 'image/jpeg',
    });

    const reportId = await animalAPI.postNewReport(reportPayload, user.token);
    const sign = await uploadAPI.getSignature(user.token);
    const photoURL = await uploadAPI.uploadPhotoToCloudinary(sign, photoData);
    const newReport = await animalAPI.addPhotoUrlToReport(reportId, photoURL, user.token);

    if (newReport) {
      setShowLoader(false);
      setSendResult(
        <>
          <Text className='text-deepSage text-h4 text-center font-manrope-bold'>Signalement envoyé !</Text>
          <Text className='text-text text-body text-center mt-2'>
            Merci pour votre signalement. Nous allons l'examiner et prendre les mesures appropriées.
          </Text>
          <View className='items-center mt-4'>
            <Button
              title='OK'
              width={'w-3/5'}
              onPress={() => {
                setIsLoading(false);
                dispatch(addReport(newReport));
                navigation.navigate('Map');
              }}
            />
          </View>
        </>,
      );
    } else {
      setShowLoader(false);
      setSendResult(
        <>
          <Text className='text-danger text-h4 text-center font-manrope-bold'>Oups...</Text>
          <Text className='text-text text-body text-center mt-2'>
            Une erreur est survenue lors de l'envoi du signalement. Veuillez réessayer plus tard...
          </Text>
          <View className='items-center mt-4'>
            <Button
              title='OK'
              width={'w-3/5'}
              onPress={() => {
                setIsLoading(false);
              }}
            />
          </View>
        </>,
      );
    }
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={{ paddingTop: 40, alignItems: 'center' }}
      style={{ flex: 1, backgroundColor: colors.offwhite }}>
      {/* BOUTONS RETOUR ET INFOS */}
      <View className='w-full mt-2 px-2 flex-row items-center justify-between'>
        <TouchableOpacity className='flex-row items-center' onPress={() => navigation.goBack()}>
          <Ionicons name='caret-back-outline' size={24} color={colors.textColor} />
          <Text className='text-body font-manrope'>Retour</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex-row items-center' onPress={() => console.log('info btn')}>
          <Text className='text-body font-manrope'>Aide</Text>
          <Ionicons name='help-circle-outline' size={26} color={colors.textColor} />
        </TouchableOpacity>
      </View>
      <Text className='text-h3 text-deepSage my-2 font-manrope-bold'>Faire un signalement</Text>
      {formError && (
        <Text className='text-error mb-2 font-semibold text-body'>
          {formError || 'Unknown error'}
        </Text>
      )}

      <Input
        label='Ma position'
        icon='location'
        value={{
          latitude: currentLocation?.latitude || null,
          longitude: currentLocation?.longitude || null,
        }}
        placeholder='Ma position'
        editable={false}
        defaultValue={
          currentLocation.latitude.toFixed(3) + '  ' + currentLocation.longitude.toFixed(3)
        }
      />

      {/* RADIO BOUTONS POUR SELECTION DE L'ANIMAL */}
      <View className='w-10/12 h-auto mb-5'>
        <Text className='text-text font-manrope mx-2'>Type d'animal</Text>
        <View className='border-[1px] border-deepSage p-3 rounded-xl flex-row justify-evenly w-auto'>
          <TouchableOpacity className='flex-row items-center' onPress={() => setAnimalType('chat')}>
            <Ionicons
              name={animalType === 'chat' ? 'radio-button-on-outline' : 'radio-button-off-outline'}
              size={32}
              color={animalType === 'chat' ? colors.softOrange : 'lightgray'}
            />
            <Text
              className='ml-1 text-center text-body font-manrope'
              style={animalType === 'chat' ? { fontWeight: 'bold' } : { color: colors.text }}>
              Chat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className='flex-row items-center'
            onPress={() => setAnimalType('chien')}>
            <Ionicons
              name={animalType === 'chien' ? 'radio-button-on-outline' : 'radio-button-off-outline'}
              size={32}
              color={animalType === 'chien' ? colors.softOrange : 'lightgray'}
            />
            <Text
              className='ml-1 text-center text-body font-manrope'
              style={animalType === 'chien' ? { fontWeight: 'bold' } : { color: colors.text }}>
              Chien
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Affichage miniature de la photo prise */}
      {photoUri && (
        <View className='w-32 h-32 mb-2 rounded-2xl overflow-hidden'>
          <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%' }} />
        </View>
      )}
      {/* Bouton vers CameraScreen */}
      <Button
        title={photoUri ? 'Reprendre la photo' : 'Prendre une photo'}
        bg={colors.offwhite}
        border='deepSage'
        textColor={colors.deepSage}
        onPress={openCamera}
      />

      {/* CHECKBOXES POUR ETAT DE SANTE ET COMPORTEMENT */}
      <View className='w-10/12 h-auto mt-2'>
        <Text className='text-text font-manrope mx-2'>Quel est son état ?</Text>
        <View className='border-[1px] border-deepSage p-1 rounded-xl flex-row justify-evenly w-auto'>
          <View className='flex-row justify-between w-10/12'>
            <View className='justify-center w-1/2'>
              <AdvancedCheckbox
                label='Blessé'
                value={animalState.includes('blesse')}
                onValueChange={checked => toggleState('blesse', checked)}
                checkedColor={colors.softOrange}
                Style={{ fontFamily: 'Manrope', marginRight: 20 }}
              />

              <AdvancedCheckbox
                label='Affaibli'
                value={animalState.includes('affaibli')}
                onValueChange={checked => toggleState('affaibli', checked)}
                checkedColor={colors.softOrange}
                Style={{ fontFamily: 'Manrope', marginRight: 20 }}
              />

              <AdvancedCheckbox
                label='En danger'
                value={animalState.includes('danger')}
                onValueChange={checked => toggleState('danger', checked)}
                checkedColor={colors.softOrange}
                Style={{ fontFamily: 'Manrope', marginRight: 20 }}
              />

              <AdvancedCheckbox
                label='Coincé'
                value={animalState.includes('coince')}
                onValueChange={checked => toggleState('coince', checked)}
                checkedColor={colors.softOrange}
                Style={{ fontFamily: 'Manrope', marginRight: 20 }}
              />

              <AdvancedCheckbox
                label='Bébés'
                value={animalState.includes('petits')}
                onValueChange={checked => toggleState('petits', checked)}
                checkedColor={colors.softOrange}
                Style={{ fontFamily: 'Manrope', marginRight: 20 }}
              />
            </View>

            <View className='justify-center w-1/2'>
              <AdvancedCheckbox
                label='Agressif'
                value={animalState.includes('agressif')}
                onValueChange={checked => toggleState('agressif', checked)}
                checkedColor={colors.softOrange}
                Style={{ fontFamily: 'Manrope', marginRight: 20 }}
              />

              <AdvancedCheckbox
                label='Peureux'
                value={animalState.includes('peureux')}
                onValueChange={checked => toggleState('peureux', checked)}
                checkedColor={colors.softOrange}
                Style={{ fontFamily: 'Manrope', marginRight: 20 }}
              />

              <AdvancedCheckbox
                label='Animal jeune'
                value={animalState.includes('jeune')}
                onValueChange={checked => toggleState('jeune', checked)}
                checkedColor={colors.softOrange}
                Style={{ fontFamily: 'Manrope', marginRight: 20 }}
              />

              <AdvancedCheckbox
                label='Sociable'
                value={animalState.includes('sociable')}
                onValueChange={checked => toggleState('sociable', checked)}
                checkedColor={colors.softOrange}
                Style={{ fontFamily: 'Manrope', marginRight: 20 }}
              />

              <AdvancedCheckbox
                label='Bonne santé'
                value={animalState.includes('sain')}
                onValueChange={checked => toggleState('sain', checked)}
                checkedColor={colors.softOrange}
                Style={{ fontFamily: 'Manrope', marginRight: 20 }}
              />
            </View>
          </View>
        </View>
      </View>

      {/* TITRE ET DESCRIPTION */}
      <View className='w-full h-auto my-2'>
        <View className='w-full justify-center items-center'>
          <Input
            label='Titre'
            icon='information-circle'
            placeholder='Titre de votre signalement'
            value={reportTitle}
            onChangeText={value => setReportTitle(value)}
          />

          <View className='w-11/12'>
            <Text className='text-text font-manrope mx-8'>Description</Text>
            <TextInput
              multiline
              placeholder='Décrivez brièvement la situation...'
              placeholderTextColor='#9b9b9b'
              maxLength={280}
              className='w-11/12 p-3 h-36 mx-auto mb-2 rounded-xl border-[1px] border-deepSage text-small font-manrope focus:border-softOrange focus:border-[2px]'
              value={description}
              onChangeText={value => setDescription(value)}
            />
          </View>
        </View>
      </View>
      {/* Bouton envoi du signalement  handleSubmit() &&  */}
      <Button
        title={isLoading ? 'Chargement' : 'Envoyer le signalement'}
        onPress={() => {
          handleSubmit() && setIsLoading(true);
          setSendResult(null);
        }}
        bg={isLoading && 'lightgray'}
      />
      <View className='h-14' />
      <CustomModal
        visible={isLoading}
        content={
          <View className='mt-12 justify-center'>
            {showLoader ?
              <SplashScreen text='Envoi des données...' />
            : <>
                {sendResult ?
                  sendResult
                : <>
                    <Text className='text-h4 text-center text-text font-manrope-bold'>
                      Voulez vous envoyer ce signalement ? Vous ne pourrez plus le modifier ensuite.
                    </Text>
                    <View className='w-full flex-row pt-6 justify-evenly'>
                      <Button
                        title='Non'
                        width={'w-5/12'}
                        bg={colors.danger}
                        onPress={() => setIsLoading(false)}
                      />
                      <Button title='Oui' width={'w-5/12'} onPress={sendReport} />
                    </View>
                  </>
                }
              </>
            }
          </View>
        }
      />
    </KeyboardAwareScrollView>
  );
}
