import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import { ClientBodyTest, NewClientBodyTest } from '../../types/types';

type UpdateClientBodyTestVariables = {
  testId: string;
  clientId: string;
  payload: Partial<ClientBodyTest>;
};

type DeleteClientBodyTestVariables = {
  id: string;
  clientId: string;
};

const clientBodyTestsQueryKey = ['clientBodyTests'];

export const useGetClientBodyTest = (clientId: string, enabled = true) => {
  return useQuery<ClientBodyTest[]>({
    queryKey: [...clientBodyTestsQueryKey, clientId],
    enabled: enabled && Boolean(clientId),
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_client_body_tests/${clientId}`, {
        headers: authHeader(),
      });
      return response.data;
    },
  });
};

export const usePostClientBodyTestPerUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: NewClientBodyTest) => {
      const response = await axios.post(`${API_URL}/add_client_body_test`, requestBody, {
        headers: authHeader(),
      });
      return response.data;
    },
    onSuccess: async (_data, requestBody) => {
      await queryClient.invalidateQueries({
        queryKey: [...clientBodyTestsQueryKey, requestBody.clientId],
      });
    },
  });
};

export const useUpdateClientBodyTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ testId, payload }: UpdateClientBodyTestVariables) => {
      const response = await axios.patch(`${API_URL}/update_client_body_test/${testId}`, payload, {
        headers: authHeader(),
      });
      return response.data;
    },
    onSuccess: async (_data, { clientId }) => {
      await queryClient.invalidateQueries({
        queryKey: [...clientBodyTestsQueryKey, clientId],
      });
    },
  });
};

export const useDeleteClientBodyTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteClientBodyTestVariables) => {
      const response = await axios.delete(`${API_URL}/delete_client_body_test/${id}`, {
        headers: authHeader(),
      });
      return response.data;
    },
    onSuccess: async (_data, { clientId }) => {
      await queryClient.invalidateQueries({
        queryKey: [...clientBodyTestsQueryKey, clientId],
      });
    },
  });
};
