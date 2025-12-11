import {
  KeyboardAvoidingView,
  Text,
  View,
  Image,
  TextInput,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useTheme from '../hooks/useTheme';
import { AdvancedCheckbox } from 'react-native-advanced-checkbox';
import CustomModal from '../components/ui/CustomModal';

export default function ReportScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();

  const currentLocation = route.params?.currentLocation || null;

  // Dummy states for inputs and checkboxes
  // const [newCurrentLocation, setNewCurrentLocation] = useState(null);
  const [animalType, setAnimalType] = useState('chat');
  const [photoUri, setPhotoUri] = useState(null);
  const [isInjured, setIsInjured] = useState(false);
  const [isHealthy, setIsHealthy] = useState(false);
  const [isAngry, setIsAngry] = useState(false);
  const [isSocial, setIsSocial] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);

  const openCamera = () => {
    navigation.navigate('Camera', {
      onPhotoTaken: uri => {
        setPhotoUri(uri);
      },
    });
  };

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
    // If all validations pass
    setFormError(null);

    let report = {
      location: { lat: currentLocation.latitude, long: currentLocation.longitude },
      animalType,
      title: reportTitle,
      photoUri,
      description,
      reporter: 'Bob',
    };
    setIsLoading(false);
    console.log(report);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-1 items-center w-full py-16 bg-offwhite'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className='w-full' contentContainerStyle={{ alignItems: 'center' }}>
          {/* BOUTONS RETOUR ET INFOS */}
          <View className='w-full px-2 flex-row items-center justify-between'>
            <TouchableOpacity className='flex-row items-center' onPress={() => navigation.goBack()}>
              <Ionicons name='caret-back-outline' size={24} color={colors.textColor} />
              <Text className='text-body font-manrope'>Retour</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='flex-row items-center'
              onPress={() => console.log('info btn')}>
              <Text className='text-body font-manrope'>Aide</Text>
              <Ionicons name='help-circle-outline' size={26} color={colors.textColor} />
            </TouchableOpacity>
          </View>
          <Text className='text-h3 text-deepSage my-3 font-manrope'>Faire un signalement</Text>
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
              <TouchableOpacity
                className='flex-row items-center'
                onPress={() => setAnimalType('chat')}>
                <Ionicons
                  name={
                    animalType === 'chat' ? 'radio-button-on-outline' : 'radio-button-off-outline'
                  }
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
                  name={
                    animalType === 'chien' ? 'radio-button-on-outline' : 'radio-button-off-outline'
                  }
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
            <View className='w-36 h-36 mb-2 rounded-2xl overflow-hidden'>
              <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%' }} />
            </View>
          )}
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
                    value={isInjured}
                    onValueChange={setIsInjured}
                    checkedColor={colors.softOrange}
                    labelStyle={{ fontFamily: 'Manrope', marginRight: 20 }}
                  />

                  <AdvancedCheckbox
                    label='Bonne santé'
                    value={isHealthy}
                    onValueChange={setIsHealthy}
                    checkedColor={colors.softOrange}
                    labelStyle={{ fontFamily: 'Manrope', marginRight: 20 }}
                  />
                </View>

                <View className='justify-center w-1/2'>
                  <AdvancedCheckbox
                    label='Agressif'
                    value={isAngry}
                    onValueChange={setIsAngry}
                    checkedColor={colors.softOrange}
                    labelStyle={{ fontFamily: 'Manrope', marginRight: 20 }}
                  />

                  <AdvancedCheckbox
                    label='Social'
                    value={isSocial}
                    onValueChange={setIsSocial}
                    checkedColor={colors.softOrange}
                    labelStyle={{ fontFamily: 'Manrope', marginRight: 20 }}
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
                  className='w-11/12 p-3 h-40 mx-auto mb-2 rounded-xl border-[1px] border-deepSage text-small font-manrope'
                  value={description}
                  onChangeText={value => setDescription(value)}
                />
              </View>
            </View>
          </View>
          <Button
            title={isLoading ? 'Chargement' : 'Envoyer le signalement'}
            onPress={handleSubmit}
            bg={isLoading && 'lightgray'}
            style={{ marginHorizontal: 'auto' }}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
