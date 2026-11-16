import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import { NewExercise } from '../../types/types';

const exercisesQueryKey = ['exercises'];

export const useGetExercises = (trainingId: number) => {
	return useQuery({
		queryKey: [...exercisesQueryKey, trainingId],
		enabled: Number.isFinite(trainingId),
		queryFn: async () => {
			const response = await axios.get(`${API_URL}/get_exercise/training/${trainingId}`, { headers: authHeader() });
			return response.data;
		},
	});
};

export const useGetExercisesByUserId = (trainingId: number, userId: number, enabled = true) => {
	return useQuery({
		queryKey: [...exercisesQueryKey, trainingId, userId],
		enabled: enabled && Number.isFinite(trainingId) && Number.isFinite(userId),
		queryFn: async () => {
			const response = await axios.get(`${API_URL}/get_exercise/training/${trainingId}/${userId}`, { headers: authHeader() });
			return response.data;
		},
	});
};

export const usePostExercise = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ requestBody, number }: { requestBody: NewExercise; number: number }) => {
			const response = await axios.post(
				`${API_URL}/add_exercise`,
				requestBody,
				{ headers: authHeader(), params: { number } }
			);
			return response.data;
		},
		onSuccess: async (_data, variables) => {
			await queryClient.invalidateQueries({ queryKey: [...exercisesQueryKey, variables.requestBody.trainingId] });
			await queryClient.invalidateQueries({ queryKey: exercisesQueryKey });
		},
	});
};

export const useDeleteExercise = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ trainingId, exerciseId }: { trainingId: number; exerciseId: number }) => {
			const response = await axios.delete(`${API_URL}/delete_exercise/${exerciseId}/${trainingId}`, { headers: authHeader() });
			return response.data;
		},
		onSuccess: async (_data, variables) => {
			await queryClient.invalidateQueries({ queryKey: [...exercisesQueryKey, variables.trainingId] });
			await queryClient.invalidateQueries({ queryKey: exercisesQueryKey });
		},
	});
};
