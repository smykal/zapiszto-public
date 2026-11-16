import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';

const languageQueryKey = ['language'];

export const useGetLanguage = () => {
  return useQuery({
    queryKey: languageQueryKey,
    queryFn: fetchLanguage,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
};

export const usePostLanguage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: { languageCode: string }) => {
      const response = await axios.post(
        `${API_URL}/post_language`,
        requestBody,
        { headers: authHeader() }
      );
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: languageQueryKey });
    },
  });
};

const fetchLanguage = async () => {
  const response = await axios.get(`${API_URL}/get_language`, {
    headers: authHeader(),
  });
  return response.data;
};
