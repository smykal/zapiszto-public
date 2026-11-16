import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import { NewTraining, TrainingNotes } from '../../types/types';

type NewTrainingPayload = {
  workbookId: number;
  date: Date;
};

type PatchTrainingNotesPayload = {
  id: number;
  notes: string;
};

const trainingsQueryKey = ['trainings'];

export const useGetTrainings = (workbookId: number) => {
  return useQuery({
    queryKey: [...trainingsQueryKey, workbookId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_trainings/workbook/${workbookId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetTrainingsByUserId = (workbookId: number, userId: number) => {
  return useQuery({
    queryKey: [...trainingsQueryKey, workbookId, userId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_trainings/workbook/${workbookId}/${userId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useDeleteTraining = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`${API_URL}/delete_training/${id}`, { headers: authHeader() });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: trainingsQueryKey });
    },
  });
};

export const useCopyTraining = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trainingId: number) => {
      const response = await axios.post(`${API_URL}/copy_training/${trainingId}`, {}, { headers: authHeader() });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: trainingsQueryKey });
    },
  });
};

export const usePostNewTraining = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ workbookId, date }: NewTrainingPayload) => {
      const requestBody: NewTraining = {
        workbook_id: workbookId,
        date,
      };

      const response = await axios.post(`${API_URL}/add_training`, requestBody, { headers: authHeader() });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: trainingsQueryKey });
    },
  });
};

export const usePatchTrainingNotes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, notes }: PatchTrainingNotesPayload) => {
      const requestBody: TrainingNotes = {
        id,
        notes,
      };

      const response = await axios.patch(`${API_URL}/patch_trening_notes`, requestBody, { headers: authHeader() });
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: trainingsQueryKey });
    },
  });
};