import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../../constants/api';
import { ExerciseAttachmentDto } from '../../types/types';
import authHeader from '../auth-header';

// Fetch exercise attachments for a specific exercise
export const useGetExerciseAttachmentsForExercise = (exerciseId: string, clientId: string) => {
  return useQuery<ExerciseAttachmentDto[]>({
    queryKey: ['exerciseAttachments', exerciseId, clientId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/exercises_attachments_for_exercise/${exerciseId}`, {
        params: { clientId },
        headers: authHeader(),
      });
      return response.data;
    },
  });
};

// Fetch exercise attachments for a dictionary exercise
export const useGetExerciseAttachmentsForDictExercise = (dictExerciseId: string) => {
  return useQuery<ExerciseAttachmentDto[]>({
    queryKey: ['exerciseAttachmentsDict', dictExerciseId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/exercises_attachments_for_dict_exercise/${dictExerciseId}`, {
        headers: authHeader(),
      });
      return response.data;
    },
  });
};

// Add a new exercise attachment
export const useAddExerciseAttachment = () => {
  return useMutation<void, Error, { file: File; exerciseId?: string; dictExerciseId?: string }>({
    mutationFn: async ({ file, exerciseId, dictExerciseId }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (exerciseId) formData.append('exerciseId', exerciseId);
      if (dictExerciseId) formData.append('dictExerciseId', dictExerciseId);

      await axios.post(`${API_URL}/exercises_attachments`, formData, {
        headers: {
          ...authHeader(),
          'Content-Type': 'multipart/form-data',
        },
      });
    },
  });
};

// Delete an exercise attachment
export const useDeleteExerciseAttachment = () => {
  return useMutation<void, Error, { exerciseId?: string; dictExerciseId?: string }>({
    mutationFn: async ({ exerciseId, dictExerciseId }) => {
      await axios.delete(`${API_URL}/exercise_attachment`, {
        params: { exerciseId, dictExerciseId },
        headers: authHeader(),
      });
    },
  });
};