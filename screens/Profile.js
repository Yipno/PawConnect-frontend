import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import Button from '../components/ui/Button';

export default function Profile() {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      style={[
        { flex: 1 },
        { justifyContent: 'center' },
        { alignItems: 'center' },
        { backgroundColor: colors.offwhite },
      ]}>
      {/* <Text style={typography.h1}>Profile</Text>
      <Text style={typography.h2}>Profile</Text>
      <Text style={[typography.h3, { color: colors.softOrange }]}>Profile</Text>
      <Text style={typography.body}>Profile</Text>
      <Text style={typography.small}>Profile</Text> */}
      <Button title='Click Me' onPress={() => alert('click')} />
      <View style={{ height: 200, width: 300, flexDirection: 'row' }}>
        <View style={{ height: 35, width: 54, backgroundColor: 'red' }}></View>
        <View className='h-10 bg-softOrange' style={{ width: 54 }}></View>
        <View></View>
      </View>
      <Button
        bg={colors.offwhite}
        textColor={colors.offwhite}
        title='Click Me'
        onPress={() => console.log('clack')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
