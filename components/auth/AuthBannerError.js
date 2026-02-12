import AppText from '../shared/AppText';

export default function AuthBannerError({ error }) {
  return (
    <>
      {error && error.kind !== 'validation' && (
        <AppText className='text-red-600 font-manrope-bold text-center text-body'>
          {error.message}
        </AppText>
      )}
    </>
  );
}
