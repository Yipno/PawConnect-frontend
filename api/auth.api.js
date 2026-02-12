import { createAppError, isAppError } from '../helpers/appError';

const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

function getAppErrorFromBackend({ code, details, status }) {
  const normalizedCode = code || 'SERVER_ERROR';

  switch (normalizedCode) {
    case 'INVALID_CREDENTIALS':
      return createAppError({
        kind: 'unauthorized',
        message: 'Identifiants invalides.',
        code: normalizedCode,
        status,
      });
    case 'USER_ALREADY_EXISTS':
      return createAppError({
        kind: 'conflict',
        message: 'Cet email est deja utilise.',
        code: normalizedCode,
        field: 'email',
        status,
      });
    case 'INVALID_INPUT':
      return createAppError({
        kind: 'validation',
        message: 'Certains champs sont invalides.',
        code: normalizedCode,
        details,
        status,
      });
    case 'ESTABLISHMENT_REQUIRED':
    case 'ESTABLISHMENT_NOT_FOUND':
    case 'ESTABLISHMENT_FORBIDDEN':
    case 'INVALID_EST_ID':
      return createAppError({
        kind: 'validation',
        message: 'Etablissement invalide.',
        code: normalizedCode,
        field: 'establishmentId',
        status,
      });
    default:
      return createAppError({
        kind: 'server',
        message: 'Une erreur serveur est survenue.',
        code: normalizedCode,
        status,
      });
  }
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
      throw getAppErrorFromBackend({
        code: data?.error,
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
