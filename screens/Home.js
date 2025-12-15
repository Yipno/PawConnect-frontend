import React, { useCallback, useState } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/ui/Button';
import useTheme from '../hooks/useTheme';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const [refreshKey, setRefreshKey] = useState(0);

  // Force le rechargement du composant à chaque fois qu’on y revient pour que le style s'affiche correctement
  useFocusEffect(
    //useFocusEffect permet d'exécuter un effet lorsque l'écran est focalisé
    useCallback(() => {
      //useCallback mémorise la fonction pour éviter de la recréer à chaque rendu
      setRefreshKey(oldKey => oldKey + 1);
    }, [])
  );

  return (
    <SafeAreaView key={refreshKey} className='flex-1 justify-evenly items-center bg-offwhite'>
      <View className=' w-11/12 items-center border-[1px] border-offwhite'>
        <Text className='text-h1 text-center text-deepSage font-manrope border-[1px] border-offwhite'>
          Bienvenue sur
        </Text>
        <Image source={require('../assets/logo-temp.png')} className='w-[240px] h-[240px]' />
      </View>
      <View className='h-1/4 w-11/12 justify-center border-[1px] border-offwhite'>
        <Text className='font-manrope text-h4 text-deepSage text-center border-[1px] border-offwhite'>
          L'application qui connecte les humains pour sauver les animaux
        </Text>
      </View>
      <View className='h-1/3 w-full items-center justify-center'>
        <Button title='Connection' onPress={() => navigation.navigate('SignIn')} />
        <Button
          bg={colors.offwhite}
          textColor={colors.deepSage}
          border='deepSage'
          title={"S'enregistrer"}
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
