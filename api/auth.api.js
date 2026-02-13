import { createAppError, isAppError, mapBackendError } from '../helpers/appError';
import { readJsonSafely } from '../helpers/readJsonSafely';

const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

async function postAuth(path, payload) {
  if (!BACKEND) {
    throw createAppError({
      kind: 'server',
      message: 'Configuration backend manquante.',
      code: 'MISCONFIGURED_BACKEND',
    });
  }

  try {
    const response = await fetch(`${BACKEND}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await readJsonSafely(response);

    if (!response.ok) {
      throw mapBackendError({
        error: data?.error,
        details: data?.details,
        status: response.status,
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

export async function signUp(payload) {
  return postAuth('/auth/signup', payload);
}

export async function signIn(payload) {
  return postAuth('/auth/login', payload);
}
