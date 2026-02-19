import { createAppError, isAppError, mapBackendError } from '../helpers/appError';
import { readJsonSafely } from '../helpers/readJsonSafely';

const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

async function requestAnimals(path, { method = 'GET', token, payload } = {}) {
  if (!BACKEND) {
    throw createAppError({
      kind: 'server',
      message: 'Configuration backend manquante.',
      code: 'SERVER_ERROR',
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
      throw mapBackendError({
        error: data?.error,
        details: data?.details,
        status: response.status,
      });
    }

    if (data === null) {
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

export async function createReport(report, token) {
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
