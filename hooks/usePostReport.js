import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addReport } from '../reducers/animals';
import * as animalAPI from '../api/animals.api';
import * as uploadAPI from '../api/upload.api';
import { validateReport } from '../helpers/reportValidation';
import { createAppError, isAppError } from '../helpers/appError';

const SUBMIT_TIMEOUT_MS = 15000; // wait up to 15 seconds for the server to respond before showing a timeout error

export default function usePostReport(token) {
  const dispatch = useDispatch();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const reset = () => {
    setError(null);
    setFieldErrors({});
    setStatus('idle');
  };

  const openConfirmIfValid = form => {
    const validation = validateReport(form);
    if (validation.error) {
      setError(validation.error);
      setFieldErrors(validation.fieldErrors);
      return null;
    } else {
      // Clear previous validation errors before opening confirmation modal.
      setError(null);
      setFieldErrors({});
      setStatus('confirm');
      return true;
    }
  };

  const submit = async form => {
    if (status === 'submitting') {
      // Prevent multiple submissions
      return;
    }

    setStatus('submitting');
    setError(null);
    setFieldErrors({});

    const reportPayload = {
      location: {
        lat: form.currentLocation.latitude,
        long: form.currentLocation.longitude,
      },
      animalType: form.animalType,
      state: form.animalState,
      title: form.title,
      desc: form.description,
    };

    const photoData = new FormData();
    photoData.append('file', {
      uri: form.photoURI,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });

    let timeoutId;
    // Timeout to avoid user being caught in infinite loading state if server doesn't respond
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(
        () =>
          reject(
            createAppError({
              kind: 'network',
              field: null,
              message: 'Le serveur ne répond pas. Veuillez réessayer.',
              code: 'TIMEOUT_ERROR',
            }),
          ),
        SUBMIT_TIMEOUT_MS,
      );
    });

    // handle the report submission process: create report, upload photo, link photo to report
    const sendReport = async () => {
      const reportId = await animalAPI.createReport(reportPayload, token);
      const sign = await uploadAPI.getSignature(token);
      const photoURL = await uploadAPI.uploadPhotoToCloudinary(sign, photoData);
      const newReport = await animalAPI.addPhotoUrlToReport(reportId, photoURL, token);
      dispatch(addReport(newReport));
      setStatus('success');
    };

    try {
      // We use Promise.race to handle the case where the server takes too long to respond. If sendReport takes longer than SUBMIT_TIMEOUT_MS, the timeout promise will reject first, allowing us to show an error message to the user.
      await Promise.race([sendReport(), timeout]);
    } catch (error) {
      if (isAppError(error)) {
        setError(error);
      } else {
        setError(
          createAppError({
            kind: 'unknown',
            field: null,
            message: "Une erreur est survenue lors de l'envoi du signalement. Veuillez réessayer.",
            code: 'UNKNOWN_ERROR',
          }),
        );
      }
      setStatus('error');
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return { submit, openConfirmIfValid, status, error, fieldErrors, reset };
}
