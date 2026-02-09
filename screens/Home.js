import { View, ImageBackground } from 'react-native';
import Button from '../components/ui/Button';
import useTheme from '../hooks/useTheme';
import AppText from '../components/ui/AppText';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <View className='flex-1 justify-between items-center bg-offwhite'>
      <ImageBackground
        source={require('../assets/background2.png')}
        className='w-full h-full absolute'></ImageBackground>
      <View className=' w-10/12 h-1/3 items-center justify-evenly bg-test/60 rounded-3xl mt-20 p-4'>
        <View>
          <AppText className='text-h2 text-center text-darkSage font-manrope'>
            Bienvenue sur
          </AppText>
          <AppText className='text-h2 text-center text-darkSage font-manrope-bold'>
            PawConnect
          </AppText>
        </View>
        {/* <Image source={require('../assets/logo-temp.png')} className='w-[240px] h-[240px]' /> */}
        <View className='w-11/12 justify-center'>
          <AppText className='font-manrope-bold text-h4 text-darkSage text-center px-4 mt-4'>
            L'application qui connecte les humains pour sauver les animaux
          </AppText>
        </View>
      </View>
      <View className='h-1/3 w-full items-center justify-end pb-12'>
        <Button
          title='Connexion'
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
