import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import { NewDictUnit, TranslationsDictUnitDto } from '../../types/types';

const dictUnitsQueryKey = ['dict-units'];

export const useGetDictUnits = () => {
  return useQuery({
    queryKey: dictUnitsQueryKey,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_units_per_user`, {
        headers: authHeader(),
      });

      return response.data;
    },
  });
};

export const usePostDictUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newUnit: NewDictUnit) => {
      const response = await axios.post(`${API_URL}/add_units`, newUnit, {
        headers: authHeader(),
      });

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: dictUnitsQueryKey,
      });
    },
  });
};

export const useDeleteDictUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unitId: string) => {
      const response = await axios.delete(`${API_URL}/delete_unit/${unitId}`, {
        headers: authHeader(),
      });

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: dictUnitsQueryKey,
      });
    },
  });
};

export const useGetDictUnitDetails = (unitId: string) => {
  return useQuery({
    queryKey: ['dict-unit-details', unitId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_unit_details/${unitId}`, {
        headers: authHeader(),
      });

      return response.data;
    },
    enabled: Boolean(unitId),
  });
};

export const useUpdateDictUnitTranslations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (translations: TranslationsDictUnitDto) => {
      const response = await axios.patch(`${API_URL}/update_dict_unit_translations`, translations, {
        headers: authHeader(),
      });

      return response.data;
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: dictUnitsQueryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: ['dict-unit-details', variables.id],
      });
    },
  });
};
