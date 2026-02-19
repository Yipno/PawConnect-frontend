import { createAppError, isAppError, mapBackendError } from '../helpers/appError';
import { readJsonSafely } from '../helpers/readJsonSafely';

const BACKEND = process.env.EXPO_PUBLIC_BACKEND;

async function requestNotifications(path, { method = 'GET', token } = {}) {
  if (!BACKEND) {
    throw createAppError({
      kind: 'server',
      message: 'configuration backend manquante.',
      code: 'SERVER_ERROR',
    });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(`${BACKEND}${path}`, {
      method,
      headers,
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
        message: 'Réponse serveur invalide.',
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

export async function fetchNotifications(token) {
  return requestNotifications('/notifications', { token });
}

export async function markNotificationAsRead(id, token) {
  const data = await requestNotifications(`/notifications/${id}/read`, {
    method: 'PATCH',
    token,
  });
  return data.result;
}

export async function markAllNotificationsAsRead(token) {
  const data = await requestNotifications('/notifications/read-all', {
    method: 'PATCH',
    token,
  });
  return data.result;
}
