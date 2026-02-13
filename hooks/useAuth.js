import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as authAPI from '../api/auth.api';
import { validateSignIn, validateSignUp } from '../helpers/authValidation';
import { useReports } from './useReports';
import { login } from '../reducers/user';

export function useSignIn() {
  const dispatch = useDispatch();
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const { fetchReports } = useReports();

  const resetError = () => {
    setError(null);
    setFieldErrors({});
    if (status === 'error') setStatus('idle');
  };

  const submit = async form => {
    if (status === 'submitting') return null;

    setStatus('submitting');
    setError(null);
    setFieldErrors({});

    const validation = validateSignIn(form);
    if (validation.error) {
      setError(validation.error);
      setFieldErrors(validation.fieldErrors);
      setStatus('error');
      return null;
    }

    try {
      const data = await authAPI.signIn({
        email: form.email,
        password: form.password,
      });
      dispatch(
        login({
          token: data.token,
          firstName: data.user.firstName,
          role: data.user.role,
          establishment: data.user?.establishment ?? null,
        }),
      );
      await fetchReports(data.token);
      setStatus('success');
    } catch (error) {
      setError(error);
      setStatus('error');
      return null;
    }
  };

  return { submit, status, error, fieldErrors, resetError };
}

export function useSignUp() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const resetError = () => {
    setError(null);
    setFieldErrors({});
    if (status === 'error') setStatus('idle');
  };

  const submit = async form => {
    if (status === 'submitting') return null;

    setStatus('submitting');
    setError(null);
    setFieldErrors({});

    const validation = validateSignUp(form);
    if (validation.error) {
      setError(validation.error);
      setFieldErrors(validation.fieldErrors);
      setStatus('error');
      return null;
    }

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      role: form.accountType === 'pro' ? 'agent' : 'civil',
      establishmentId: form.accountType === 'pro' ? form.establishment : null,
    };

    try {
      const data = await authAPI.signUp(payload);
      setStatus('success');
      return data;
    } catch (error) {
      setError(error);
      setStatus('error');
      return null;
    }
  };

  return { submit, status, error, fieldErrors, resetError };
}
