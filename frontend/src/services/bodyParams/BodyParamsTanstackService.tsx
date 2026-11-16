import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import { BodyParamDto, BmrType, BodyParamsItem, CpfType } from '../../types/types';

const bodyParamsQueryKey = ['bodyParams'];
const dictionaryQueryKey = [...bodyParamsQueryKey, 'dictionary'];

const actualBodyParamsQueryKey = [...bodyParamsQueryKey, 'actual'];
const allBodyParamsQueryKey = [...bodyParamsQueryKey, 'all'];
const bmiQueryKey = [...bodyParamsQueryKey, 'bmi'];
const genderQueryKey = [...bodyParamsQueryKey, 'gender'];
const ageQueryKey = [...bodyParamsQueryKey, 'age'];
const bmrQueryKey = [...bodyParamsQueryKey, 'bmr'];
const cpfQueryKey = [...bodyParamsQueryKey, 'cpf'];

export const useGetDictBodyParams = () => {
  return useQuery({
    queryKey: dictionaryQueryKey,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/dictBodyParams`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetActualBodyParams = () => {
  return useQuery({
    queryKey: actualBodyParamsQueryKey,
    queryFn: fetchActualBodyParams,
  });
};

export const useGetActualBodyParamsByUserId = (userId: number, enabled = true) => {
  return useQuery({
    queryKey: [...actualBodyParamsQueryKey, 'user', userId],
    enabled: enabled && userId > 0,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/actual_body_params/user/${userId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetActualBodyParamsByClientId = (clientId: string, enabled = true) => {
  return useQuery({
    queryKey: [...actualBodyParamsQueryKey, 'client', clientId],
    enabled: enabled && Boolean(clientId),
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/actual_body_params/client/${clientId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetAllBodyParams = () => {
  return useQuery<BodyParamsItem[]>({
    queryKey: allBodyParamsQueryKey,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/all_body_params`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetAllBodyParamsByUserId = (userId: number, enabled = true) => {
  return useQuery<BodyParamsItem[]>({
    queryKey: [...allBodyParamsQueryKey, 'user', userId],
    enabled: enabled && userId > 0,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/all_body_params/user/${userId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetAllBodyParamsByClientId = (clientId: string, enabled = true) => {
  return useQuery<BodyParamsItem[]>({
    queryKey: [...allBodyParamsQueryKey, 'client', clientId],
    enabled: enabled && Boolean(clientId),
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/all_body_params/client/${clientId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetBmiParams = () => {
  return useQuery({
    queryKey: bmiQueryKey,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/bmi`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetGender = () => {
  return useQuery({
    queryKey: genderQueryKey,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_sex`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetGenderByUserId = (userId: number) => {
  return useQuery({
    queryKey: [...genderQueryKey, 'user', userId],
    enabled: userId > 0,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_sex/${userId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetAge = () => {
  return useQuery({
    queryKey: ageQueryKey,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_age`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetAgeByUserId = (userId: number) => {
  return useQuery({
    queryKey: [...ageQueryKey, 'user', userId],
    enabled: userId > 0,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_age/${userId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetBmr = () => {
  return useQuery<BmrType[]>({
    queryKey: bmrQueryKey,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_bmr`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetCpf = () => {
  return useQuery<CpfType[][]>({
    queryKey: cpfQueryKey,
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/cpf`, { headers: authHeader() });
      return response.data;
    },
  });
};

const invalidateBodyParams = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await queryClient.invalidateQueries({ queryKey: bodyParamsQueryKey });
};

export const usePostBodyParam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bodyParamDto: BodyParamDto) => {
      const response = await axios.post(`${API_URL}/add_body_param`, bodyParamDto, { headers: authHeader() });
      return response.data;
    },
    onSuccess: () => invalidateBodyParams(queryClient),
  });
};

export const usePostSex = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sex: string) => {
      const response = await axios.post(`${API_URL}/post_sex`, { gender: sex }, { headers: authHeader() });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: genderQueryKey }),
  });
};

export const usePostBirthDate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (date: Date) => {
      const response = await axios.post(`${API_URL}/post_birthdate`, { birthDate: date }, { headers: authHeader() });
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ageQueryKey }),
  });
};

export const useDeleteBodyParam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`${API_URL}/delete_body_param/id/${id}`, { headers: authHeader() });
      return response.data;
    },
    onSuccess: () => invalidateBodyParams(queryClient),
  });
};

export const useUpdateBodyParam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedParam }: { id: number; updatedParam: unknown }) => {
      const response = await axios.patch(`${API_URL}/update_body_param/id/${id}`, updatedParam, { headers: authHeader() });
      return response.data;
    },
    onSuccess: () => invalidateBodyParams(queryClient),
  });
};

const fetchActualBodyParams = async () => {
  const response = await axios.get(`${API_URL}/actual_body_params`, { headers: authHeader() });
  return response.data;
};
