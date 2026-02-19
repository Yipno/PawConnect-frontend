import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, CameraView, CameraType, FlashMode } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import useTheme from '../hooks/useTheme';
import { useRoute } from '@react-navigation/native';
import AppText from '../components/shared/AppText';

export default function CameraScreen({ navigation }) {
  const { colors } = useTheme();
  const isFocused = useIsFocused();
  const camRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [flash, setFlash] = useState('off');
  const [ready, isReady] = useState(false);
  const [photo, setPhoto] = useState(null);

  const route = useRoute();
  const { onPhotoTaken } = route.params;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (!hasPermission || !isFocused) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AppText>Permission caméra requise…</AppText>
      </View>
    );
  }

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
    console.log('flash toggled');
  };

  const takePicture = async () => {
    if (camRef.current) {
      const pic = await camRef.current.takePictureAsync({ quality: 0.4 });
      setPhoto(pic);
      if (photo) {
        // You can navigate back with the photo data
        onPhotoTaken(photo.uri);
      }
    }
  };

  return (
    <View className='flex-1'>
      {photo ?
        <ImageBackground
          source={{ uri: photo.uri }}
          style={{ flex: 1, justifyContent: 'space-between' }}>
          <View
            className='flex-2 justify-end items-center mx-20 p-2 mt-20 rounded-2xl'
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
            <AppText className='text-h2 text-center text-offwhite font-manrope-bold'>
              Voulez vous utiliser cette photo ?
            </AppText>
          </View>
          <View className='flex-2 flex-row justify-between items-end mb-14 mx-10'>
            <TouchableOpacity
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              className='w-40 items-center p-4 rounded-2xl'
              onPress={() => setPhoto(null)}>
              <Ionicons name='trash-outline' size={60} color='#dc2626' />
              <AppText className='text-center text-xl text-red-600 font-manrope-bold'>
                Reprendre
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
              className='w-40 items-center p-4 rounded-2xl'
              onPress={() => {
                onPhotoTaken(photo.uri);
                navigation.goBack();
              }}>
              <Ionicons name='checkmark-circle-outline' size={60} color='#22c52e' />
              <AppText className='text-center text-xl text-green-500 font-manrope-bold'>
                Utiliser
              </AppText>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      : <CameraView
          ref={ref => (camRef.current = ref)}
          style={{ flex: 1 }}
          facing={'back'}
          flashMode={flash}
          onCameraReady={() => isReady(true)}>
          <View className='flex-row justify-between items-center px-4 pt-20'>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name='close-circle-outline' size={60} color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleFlash}>
              <Ionicons
                name={flash === 'off' ? 'flash-outline' : 'flash'}
                size={50}
                color={flash === 'off' ? 'white' : 'yellow'}
              />
            </TouchableOpacity>
          </View>
          <View className='flex-1 justify-end items-center mb-10'>
            <TouchableOpacity onPress={takePicture} disabled={!ready}>
              <Ionicons name='radio-button-on' size={90} color={ready ? 'white' : 'gray'} />
            </TouchableOpacity>
          </View>
        </CameraView>
      }
    </View>
  );
}
