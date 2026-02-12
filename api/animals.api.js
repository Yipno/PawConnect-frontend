import { createAppError, isAppError } from '../helpers/appError';

const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

function getAnimalAppError({ code, details, status }) {
  const normalizedCode = code || 'SERVER_ERROR';

  if (status === 401) {
    return createAppError({
      kind: 'unauthorized',
      message: 'Session invalide. Veuillez vous reconnecter.',
      code: normalizedCode,
      status,
      details,
    });
  }

  if (status === 400) {
    return createAppError({
      kind: 'validation',
      message: 'Donnees invalides.',
      code: normalizedCode,
      status,
      details,
    });
  }

  return createAppError({
    kind: 'server',
    message: 'Une erreur est survenue lors du traitement du signalement.',
    code: normalizedCode,
    status,
    details,
  });
}

async function readJsonSafely(response) {
  const rawText = await response.text();
  if (!rawText) return null;
  try {
    return JSON.parse(rawText);
  } catch {
    return null;
  }
}

async function requestAnimals(path, { method = 'GET', token, payload } = {}) {
  if (!BACKEND) {
    throw createAppError({
      kind: 'server',
      message: 'Configuration backend manquante.',
      code: 'MISCONFIGURED_BACKEND',
    });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (payload != null) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${BACKEND}${path}`, {
      method,
      headers,
      body: payload != null ? JSON.stringify(payload) : undefined,
    });

    const data = await readJsonSafely(response);

    if (!response.ok) {
      throw getAnimalAppError({
        status: response.status,
        code: data?.error,
        details: data?.details,
      });
    }

    if (data == null) {
      throw createAppError({
        kind: 'server',
        message: 'Reponse serveur invalide.',
        code: 'INVALID_JSON',
        status: response.status,
      });
    }

    return data;
  } catch (error) {
    if (isAppError(error)) {
      throw error;
    }

    throw createAppError({
      kind: 'network',
      message: 'Probleme de connexion au serveur.',
      code: 'NETWORK_ERROR',
    });
  }
}

export async function postNewReport(report, token) {
  return requestAnimals('/animals', {
    method: 'POST',
    token,
    payload: { ...report },
  });
}

export async function addPhotoUrlToReport(reportId, photoUrl, token) {
  return requestAnimals(`/animals/${reportId}/photo`, {
    method: 'PATCH',
    token,
    payload: { photoUrl },
  });
}

export async function getUserReports(token) {
  return requestAnimals('/animals/me', { token });
}
