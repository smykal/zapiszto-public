import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import authHeader from '../auth-header';
import { CardAddressDto } from '../../types/types';
import { API_URL } from '../../constants/api';

type CreateAddressPayload = {
  cardId: string;
  gymName?: string;
  gymAddress?: string;
  city?: string;
  countryId?: string;
};

const cardAddressesQueryKey = ['cardAddresses'];

export const useGetAddressesByCardId = (cardId?: string, enabled = true) => {
  return useQuery<CardAddressDto[]>({
    queryKey: [...cardAddressesQueryKey, cardId],
    enabled: enabled && Boolean(cardId),
    queryFn: async () => {
      const response = await axios.get<CardAddressDto[]>(`${API_URL}/cardAddresses/${cardId}`, {
        headers: authHeader(),
      });
      return response.data;
    },
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAddressPayload) => {
      const response = await axios.post<CardAddressDto>(`${API_URL}/cardAddresses`, payload, {
        headers: authHeader(),
      });
      return response.data;
    },
    onSuccess: async (_data, payload) => {
      await queryClient.invalidateQueries({
        queryKey: [...cardAddressesQueryKey, payload.cardId],
      });
    },
  });
};
