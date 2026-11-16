import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';

// Fetch exercise stats by mesocycle ID
export const useGetExerciseStats = (mesocycleId: string) => {
  return useQuery({
    queryKey: ['exerciseStats', mesocycleId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_exercise_stats/${mesocycleId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

// Fetch exercise stats by program ID
export const useGetExerciseStatsByProgramId = (programId: string) => {
  return useQuery({
    queryKey: ['exerciseStatsByProgramId', programId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_exercise_stats/programId/${programId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

// Fetch training frequency by workbook ID
export const useGetTrainingsFrequency = (workbookId: number) => {
  return useQuery({
    queryKey: ['trainingsFrequency', workbookId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_trainings_frequency/${workbookId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

// Fetch volume, sets, and reps for each date in a category
export const useGetVolumeSetsRepsForEachDateInCategory = (workbookId: number) => {
  return useQuery({
    queryKey: ['volumeSetsRepsForEachDateInCategory', workbookId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_repetitions_sets_volume_for_each_training_and_date/${workbookId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

// Fetch volume, max volume, and average volume for each exercise in each training
export const useGetVolumeMaxVolumeAvgVolumeForEachExerciseEachTraining = (workbookId: number) => {
  return useQuery({
    queryKey: ['volumeMaxVolumeAvgVolumeForEachExerciseEachTraining', workbookId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_volume_max_volume_avg_volume_for_each_exercise_each_training/${workbookId}`, { headers: authHeader() });
      return response.data;
    },
  });
};

// Fetch time, max time, and average time for each exercise in each training
export const useGetTimeMaxTimeAvgTimeForEachExerciseEachTraining = (workbookId: number) => {
  return useQuery({
    queryKey: ['timeMaxTimeAvgTimeForEachExerciseEachTraining', workbookId],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/get_time_max_time_avg_time_for_each_exercise_each_training/${workbookId}`, { headers: authHeader() });
      return response.data;
    },
  });
};