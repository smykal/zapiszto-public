import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';

// Fetch comments by entity origin and entity ID
export const useGetComments = (entityOrigin: string, entityId: string) => {
  return useQuery({
    queryKey: ['comments', entityOrigin, entityId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/comments/${entityOrigin}/${entityId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

// Create a new comment
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newComment: { content: string; origin: string; originId: string }) => {
      await axios.post(`${API_URL}/comment`, newComment, { headers: authHeader() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

// Delete a comment by comment ID
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: string) => {
      await axios.delete(`${API_URL}/comment/${commentId}`, { headers: authHeader() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};