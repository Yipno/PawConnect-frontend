import { View } from 'react-native';
import AppText from '../shared/AppText';
import Button from '../shared/Button';
import CustomModal from '../shared/CustomModal';
import SplashScreen from '../shared/SplashScreen';

function ConfirmSubmitModal({ visible, status, error, onConfirm, onClose, onSuccess }) {
  const successMsg = (
    <>
      <AppText className='text-deepSage text-h4 text-center font-manrope-bold'>
        Signalement envoyé !
      </AppText>
      <AppText className='text-text text-body text-center mt-2'>
        Merci pour votre signalement. Nous allons l'examiner et prendre les mesures appropriées.
      </AppText>
      <View className='items-center mt-4'>
        <Button title='OK' width={'w-3/5'} onPress={onSuccess} />
      </View>
    </>
  );

  const errorMsg = (
    <>
      <AppText className='text-danger text-h4 text-center font-manrope-bold'>Oups...</AppText>
      <AppText className='text-text text-body text-center mt-2'>
        Une erreur est survenue lors de l'envoi du signalement.{' '}
        {error?.message || 'Veuillez réessayer.'}
      </AppText>
      <View className='items-center mt-4'>
        <Button title='OK' width={'w-3/5'} onPress={onClose} />
      </View>
    </>
  );

  return (
    <CustomModal
      visible={visible}
      onClose={status === 'submitting' ? null : onClose}
      content={
        <View className='mt-12 justify-center'>
          {status === 'submitting' ?
            <SplashScreen text='Envoi des données...' />
          : <>
              {status === 'success' ?
                successMsg
              : status === 'error' ?
                errorMsg
              : <>
                  <AppText className='text-h4 text-center text-text font-manrope-bold'>
                    Voulez vous envoyer ce signalement ? Vous ne pourrez plus le modifier ensuite.
                  </AppText>
                  <View className='w-full flex-row pt-6 justify-evenly'>
                    <Button title='Non' width={'w-5/12'} bg='danger' onPress={onClose} />
                    <Button title='Oui' width={'w-5/12'} onPress={onConfirm} />
                  </View>
                </>
              }
            </>
          }
        </View>
      }
    />
  );
}

export default ConfirmSubmitModal;
