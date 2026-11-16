import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import { NewWorkbook, WorkbookSchemaIdPut } from '../../types/types';

const workbooksQueryKey = ['workbooks'];
const workbookSchemaQueryKey = ['workbookSchema'];

export const useGetWorkbooks = () => {
	return useQuery({
		queryKey: workbooksQueryKey,
		queryFn: async () => {
			const response = await axios.get(`${API_URL}/get_workbooks`, { headers: authHeader() });
			return response.data;
		},
	});
};

export const useGetDictWorkbookSchema = () => {
	return useQuery({
		queryKey: workbookSchemaQueryKey,
		queryFn: async () => {
			const response = await axios.get(`${API_URL}/get_dict_workbook_schema`, { headers: authHeader() });
			return response.data;
		},
	});
};

export const useGetWorkbooksByUserId = (userId: number, enabled = true) => {
	return useQuery({
		queryKey: [...workbooksQueryKey, userId],
		enabled,
		queryFn: async () => {
			const response = await axios.get(`${API_URL}/get_workbooks/${userId}`, { headers: authHeader() });
			return response.data;
		},
	});
};

export const usePostNewWorkbook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (name: string) => {
			const newWorkbook: NewWorkbook = {
				name,
			};

			const response = await axios.post(`${API_URL}/add_workbook`, newWorkbook, { headers: authHeader() });
			return response.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: workbooksQueryKey });
		},
	});
};

export const useDeleteWorkbook = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: number) => {
			const response = await axios.delete(`${API_URL}/delete_workbook/${id}`, { headers: authHeader() });
			return response.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: workbooksQueryKey });
		},
	});
};

export const usePutWorkbookSchemaId = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, dict_workbook_schema_id }: WorkbookSchemaIdPut) => {
			const requestBody: WorkbookSchemaIdPut = {
				id,
				dict_workbook_schema_id,
			};

			const response = await axios.patch(`${API_URL}/put_workbook_schema_id`, requestBody, { headers: authHeader() });
			return response.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: workbooksQueryKey });
			await queryClient.invalidateQueries({ queryKey: workbookSchemaQueryKey });
		},
	});
};

