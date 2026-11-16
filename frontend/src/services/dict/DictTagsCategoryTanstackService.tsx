import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import { NewDictTagsCategory } from '../../types/types';

const dictTagsCategoryQueryKey = ['dict-tags-category'];

export const useGetDictTagsCategory = () => {
  return useQuery({
    queryKey: dictTagsCategoryQueryKey,
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/dict_tags_category`,
        { headers: authHeader() }
      );

      return response.data;
    },
  });
};

export const usePostDictTagsCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newDictTagCategory: NewDictTagsCategory) => {
      const response = await axios.post(
        `${API_URL}/dict_tags_category`,
        newDictTagCategory,
        { headers: authHeader() }
      );

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: dictTagsCategoryQueryKey,
      });
    },
  });
};