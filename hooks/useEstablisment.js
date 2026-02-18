import { useDispatch } from 'react-redux';
import { getEstablishments } from '../reducers/establishments';
import * as establishmentAPI from '../api/establishments.api';
import { createAppError } from '../helpers/appError';

export function useEstablishment() {
  const dispatch = useDispatch();

  const fetchEstablishment = async token => {
    try {
      const data = await establishmentAPI.getEstablishments(token);
      if (!data?.establishments) {
        throw createAppError({
          kind: 'server',
          message: "Format de reponse invalide pour l'établissement.",
          code: 'INVALID_ESTABLISHMENT_PAYLOAD',
        });
      }
      dispatch(getEstablishments(data.establishments));
    } catch (error) {
      console.log('error fetching establishment', error);
      throw error;
    }
  };

  return { fetchEstablishment };
}
