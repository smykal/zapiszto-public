import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import { Goal, GoalDetailsDto, NewGoal, UpdateGoal } from '../../types/types';

const goalsQueryKey = ['goals'];

export const useGetGoals = (clientId: string, enabled = true) => {
  return useQuery<Goal[]>({
    queryKey: [...goalsQueryKey, clientId],
    enabled: enabled && Boolean(clientId),
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_goals/${clientId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const useGetGoalDetails = (clientId: string, enabled = true) => {
  return useQuery<GoalDetailsDto[]>({
    queryKey: [...goalsQueryKey, 'details', clientId],
    enabled: enabled && Boolean(clientId),
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_goals_details/${clientId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

export const usePostNewGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: NewGoal) => {
      const response = await axios.post(`${API_URL}/add_goal`, requestBody, { headers: authHeader() });
      return response.data;
    },
    onSuccess: async (_data, requestBody) => {
      await queryClient.invalidateQueries({ queryKey: [...goalsQueryKey, requestBody.clientId] });
      await queryClient.invalidateQueries({ queryKey: [...goalsQueryKey, 'details', requestBody.clientId] });
    },
  });
};

export const usePutGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestBody: UpdateGoal) => {
      const response = await axios.patch(`${API_URL}/update_goal`, requestBody, { headers: authHeader() });
      return response.data;
    },
    onSuccess: async (_data, requestBody) => {
      await queryClient.invalidateQueries({ queryKey: [...goalsQueryKey, requestBody.clientId] });
      await queryClient.invalidateQueries({ queryKey: [...goalsQueryKey, 'details', requestBody.clientId] });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId }: { goalId: string; clientId: string }) => {
      const response = await axios.delete(`${API_URL}/delete_goal/${goalId}`, { headers: authHeader() });
      return response.data;
    },
    onSuccess: async (_data, { clientId }) => {
      await queryClient.invalidateQueries({ queryKey: [...goalsQueryKey, clientId] });
      await queryClient.invalidateQueries({ queryKey: [...goalsQueryKey, 'details', clientId] });
    },
  });
};