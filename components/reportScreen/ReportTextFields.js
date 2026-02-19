import { View, TextInput } from 'react-native';
import AppText from '../shared/AppText';
import Input from '../shared/Input';

function ReportTextFields({ title, onChangeTitle, description, onChangeDescription }) {
  return (
    <View className='w-full h-auto my-2'>
      <View className='w-full justify-center items-center'>
        <Input
          label='Titre'
          icon='information-circle'
          placeholder='Titre de votre signalement'
          value={title}
          onChangeText={onChangeTitle}
        />

        <View className='w-11/12'>
          <AppText className='text-text font-manrope mx-8'>Description</AppText>
          <TextInput
            multiline
            placeholder='Décrivez brièvement la situation...'
            placeholderTextColor='#9b9b9b'
            maxLength={280}
            className='w-11/12 p-3 h-32 mx-auto mb-2 rounded-xl border-[1px] border-deepSage text-small font-manrope focus:border-softOrange focus:border-[2px]'
            value={description}
            onChangeText={onChangeDescription}
          />
        </View>
      </View>
    </View>
  );
}

export default ReportTextFields;
