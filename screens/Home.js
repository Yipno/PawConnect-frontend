import { Text, StyleSheet, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/ui/Button';
import useTheme from '../hooks/useTheme';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  return (
<<<<<<< HEAD
    <SafeAreaView className='flex-1 justify-evenly items-center bg-offwhite'>
      <View className='h-1/3 w-11/12 items-center'>
        <Text className='text-h1 text-center font-manrope'>Bienvenue sur</Text>
        <Image source={require('../assets/logo-temp.png')} className='w-[240px] h-[240px]' />
      </View>
      <View className='h-1/4 w-11/12 justify-center'>
        <Text className='font-manrope text-h4 text-center'>
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
=======
    <SafeAreaView>
      <Text>HomeScreen</Text>

      <Button
        title="Aller à SignUp"
        onPress={() => navigation.navigate('SignUp')}
      />
>>>>>>> SignUp-frontend
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
