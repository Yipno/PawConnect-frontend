import { useDispatch } from 'react-redux';
import { getReports } from '../reducers/animals';
import * as animalAPI from '../api/animals.api';
import { createAppError } from '../helpers/appError';

export function useReports() {
  const dispatch = useDispatch();

  const fetchReports = async token => {
    const data = await animalAPI.getUserReports(token);
    if (!Array.isArray(data?.reports)) {
      throw createAppError({
        kind: 'server',
        message: 'Format de reponse invalide pour la liste des signalements.',
        code: 'INVALID_REPORTS_PAYLOAD',
      });
    }
    dispatch(getReports(data.reports));
  };

  return { fetchReports };
}
