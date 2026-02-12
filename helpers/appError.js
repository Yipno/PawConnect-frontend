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
