import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import {
  NewDictTagsDto,
  TranslationsDictTagsDto,
} from '../../types/types';

const dictTagsQueryKey = ['dict-tags'];

export const useGetDictTags = () => {
  return useQuery({
    queryKey: dictTagsQueryKey,
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/get_tags_basic`,
        { headers: authHeader() }
      );
      return response.data;
    },
  });
};

export const useGetDictTagsForBodyPhoto = (photoId: string) => {
  return useQuery({
    queryKey: [...dictTagsQueryKey, 'body-photo', photoId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/get_tags_basic_for_body_photo/${photoId}`,
        { headers: authHeader() }
      );
      return response.data;
    },
    enabled: !!photoId,
  });
};

export const useGetDictTagDetails = (dictTagId: string) => {
  return useQuery({
    queryKey: [...dictTagsQueryKey, dictTagId],
    queryFn: async () => {
      const response = await axios.get(
        `${API_URL}/get_tags_basic/${dictTagId}`,
        { headers: authHeader() }
      );
      return response.data;
    },
    enabled: !!dictTagId,
  });
};

export const usePostDictTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newDictTag: NewDictTagsDto) => {
      const response = await axios.post(
        `${API_URL}/add_tags_basic`,
        newDictTag,
        { headers: authHeader() }
      );

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: dictTagsQueryKey,
      });
    },
  });
};

export const useDeleteDictTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dictTagId: string) => {
      const response = await axios.delete(
        `${API_URL}/dict_tag/${dictTagId}`,
        { headers: authHeader() }
      );

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: dictTagsQueryKey,
      });
    },
  });
};

export const useUpdateDictTagTranslations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (translations: TranslationsDictTagsDto) => {
      const response = await axios.patch(
        `${API_URL}/update_dict_quantity_type_translations`,
        translations,
        { headers: authHeader() }
      );

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: dictTagsQueryKey,
      });
    },
  });
};