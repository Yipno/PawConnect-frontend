import { createAppError, isAppError, mapBackendError } from '../helpers/appError';
import { readJsonSafely } from '../helpers/readJsonSafely';

const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

async function requestEstablishments(path, { method = 'GET', token, payload } = {}) {
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

export function getEstablishments(token) {
  return requestEstablishments('/establishments', { token });
}

export function getEstablishmentById(id, token) {
  return requestEstablishments(`/establishments/${id}`, { token });
}

export function postNewEstablishment(establishment, token) {
  return requestEstablishments('/establishments', {
    method: 'POST',
    token,
    payload: { ...establishment },
  });
}
