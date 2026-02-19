import { createAppError } from './appError';

export function validateReport(form) {
  const title = String(form?.title ?? '').trim();
  const description = String(form?.description ?? '').trim();
  const photoURI = String(form?.photoURI ?? '').trim();
  const currentLocation = form?.currentLocation;
  const fieldErrors = {};

  if (!title) {
    fieldErrors.title = 'Veuillez entrer un titre.';
  }

  if (!description) {
    fieldErrors.description = 'Veuillez entrer une description.';
  }

  if (!photoURI) {
    fieldErrors.photoURI = "Veuillez prendre une photo de l'animal.";
  }

  if (!currentLocation || !currentLocation.latitude || !currentLocation.longitude) {
    fieldErrors.currentLocation = 'Veuillez partager votre position actuelle.';
  }

  const entries = Object.entries(fieldErrors);
  if (entries.length === 0) {
    return { error: null, fieldErrors: {} };
  }

  const [field, message] = entries[0];
  return {
    error: createAppError({
      kind: 'validation',
      field,
      message,
      code: 'VALIDATION_ERROR',
    }),
    fieldErrors,
  };
}
