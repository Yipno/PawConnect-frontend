export function createAppError({ kind, message, code, field, details, status }) {
  const error = new Error(message);
  error.name = 'AppError';
  error.kind = kind;
  error.code = code;
  error.field = field;
  error.details = details;
  error.status = status;
  error.isAppError = true;
  return error;
}

export function isAppError(error) {
  return Boolean(error?.isAppError);
}

const BACKEND_ERROR_MAP = {
  INVALID_INPUT: { kind: 'validation', message: 'Certains champs sont invalides.' },
  UNAUTHORIZED: { kind: 'unauthorized', message: 'Identifiants invalides ou session expirée.' },
  FORBIDDEN: { kind: 'forbidden', message: 'Action non autorisée.' },
  NOT_FOUND: { kind: 'not_found', message: 'Ressource introuvable.' },
  CONFLICT: { kind: 'conflict', message: 'Cette ressource existe déjà.' },
  RATE_LIMITED: { kind: 'rate_limited', message: 'Trop de requêtes. Réessayez plus tard.' },
  SERVER_ERROR: { kind: 'server', message: 'Une erreur serveur est survenue.' },
  MISCONFIGURED: { kind: 'server', message: 'Une erreur serveur est survenue.' },
};

export function mapBackendError({ error, details, status }) {
  const mapping = BACKEND_ERROR_MAP[error] || BACKEND_ERROR_MAP.SERVER_ERROR;

  return createAppError({
    kind: mapping.kind,
    message: mapping.message,
    code: error || 'SERVER_ERROR',
    details,
    status,
  });
}
