import React, { useCallback, useState } from 'react';
import { Text, View, Image, ImageBackground } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../components/ui/Button';
import useTheme from '../hooks/useTheme';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  // const [refreshKey, setRefreshKey] = useState(0);

  // // Force le rechargement du composant à chaque fois qu’on y revient pour que le style s'affiche correctement
  // useFocusEffect(
  //   //useFocusEffect permet d'exécuter un effet lorsque l'écran est focalisé
  //   useCallback(() => {
  //     //useCallback mémorise la fonction pour éviter de la recréer à chaque rendu
  //     setRefreshKey(oldKey => oldKey + 1);
  //   }, [])
  // );

  return (
    <View className='flex-1 justify-between items-center bg-offwhite'>
      <ImageBackground
        source={require('../assets/background2.png')}
        className='w-full h-full absolute'></ImageBackground>
      <View className=' w-10/12 h-1/3 items-center justify-evenly bg-test/60 rounded-3xl mt-20 p-4'>
        <View>
          <Text className='text-h2 text-center text-darkSage font-manrope'>Bienvenue sur</Text>
          <Text className='text-h2 text-center font-bold text-darkSage font-manrope'>
            PawConnect
          </Text>
        </View>
        {/* <Image source={require('../assets/logo-temp.png')} className='w-[240px] h-[240px]' /> */}
        <View className='w-11/12 justify-center'>
          <Text className='font-manrope text-h4 text-darkSage text-center px-4 mt-4'>
            L'application qui connecte les humains pour sauver les animaux
          </Text>
        </View>
      </View>
      <View className='h-1/3 w-full items-center justify-end pb-12'>
        <Button
          title='Connection'
          textColor={colors.test}
          onPress={() => navigation.navigate('SignIn')}
        />
        <Button
          bg={colors.test}
          textColor={colors.deepSage}
          border='deepSage'
          title={"S'enregistrer"}
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </View>
  );
}
