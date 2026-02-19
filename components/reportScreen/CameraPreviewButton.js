import { View, Image } from 'react-native';
import Button from '../shared/Button';

function CameraPreviewButton({ photoURI, onOpenCamera }) {
  return (
    <>
      {photoURI && (
        <View className='w-32 h-32 mb-2 rounded-2xl overflow-hidden'>
          <Image source={{ uri: photoURI }} style={{ width: '100%', height: '100%' }} />
        </View>
      )}

      <Button
        title={photoURI ? 'Reprendre la photo' : 'Prendre une photo'}
        bg='offwhite'
        border='deepSage'
        textColor='deepSage'
        onPress={onOpenCamera}
      />
    </>
  );
}

export default CameraPreviewButton;
