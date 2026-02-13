import { createAppError } from './appError';

const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;

function buildValidationResult(fieldErrors) {
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

export function validateSignUp(form) {
  const firstName = String(form?.firstName ?? '').trim();
  const lastName = String(form?.lastName ?? '').trim();
  const email = String(form?.email ?? '').trim();
  const password = String(form?.password ?? '');
  const passwordConfirm = String(form?.passwordConfirm ?? '');
  const accountType = form?.accountType ?? 'civil';
  const establishment = String(form?.establishment ?? '').trim();
  const fieldErrors = {};

  if (!firstName) {
    fieldErrors.firstName = 'Champ requis.';
  }

  if (!lastName) {
    fieldErrors.lastName = 'Champ requis.';
  }

  if (!email) {
    fieldErrors.email = 'Champ requis.';
  }

  if (email && !EMAIL_REGEX.test(email)) {
    fieldErrors.email = 'Email invalide.';
  }

  if (!password) {
    fieldErrors.password = 'Champ requis.';
  }

  if (password && password.length < 6) {
    fieldErrors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
  }

  if (!passwordConfirm) {
    fieldErrors.passwordConfirm = 'Champ requis.';
  }

  if (password && passwordConfirm && password !== passwordConfirm) {
    fieldErrors.passwordConfirm = 'Les mots de passe ne sont pas identiques.';
  }

  if (accountType === 'pro' && !establishment) {
    fieldErrors.establishment = "L'établissement est requis pour un compte pro/association.";
  }

  return buildValidationResult(fieldErrors);
}

export function validateSignIn(form) {
  const email = String(form?.email ?? '').trim();
  const password = String(form?.password ?? '');
  const fieldErrors = {};

  if (!email) {
    fieldErrors.email = 'Champ requis.';
  }
  if (!password) {
    fieldErrors.password = 'Champ requis.';
  }

  if (email && !EMAIL_REGEX.test(email)) {
    fieldErrors.email = 'Email invalide.';
  }

  if (password && password.length < 6) {
    fieldErrors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
  }

  return buildValidationResult(fieldErrors);
}
