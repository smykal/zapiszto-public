import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';

class DiagramService {
  getExerciseStats(mesocycleId: string) {
    return axios.get(`${API_URL}/get_exercise_stats/${mesocycleId}`, { headers: authHeader() });
  }

  getExerciseStatsByProgramId(programId: string) {
        return axios.get(`${API_URL}/get_exercise_stats/programId/${programId}`, { headers: authHeader() });
  }

  getTrainingsFrequency(workbookId: number) {
    return axios.get(`${API_URL}/get_trainings_frequency/${workbookId}`, { headers: authHeader() });
  }

  getVolumeSetsRepsForEachDateInCategory(workbookId: number) {
    return axios.get(`${API_URL}/get_repetitions_sets_volume_for_each_training_and_date/${workbookId}`, { headers: authHeader() });
  }

  getVolumeMaxVolumeAvgVolumeForEachExerciseEachTraining(workbookId: number) {
    return axios.get(`${API_URL}/get_volume_max_volume_avg_volume_for_each_exercise_each_training/${workbookId}`, { headers: authHeader() });
  }

  getTimeMaxTimeAvgTimeForEachExerciseEachTraining(workbookId: number) {
    return axios.get(`${API_URL}/get_time_max_time_avg_time_for_each_exercise_each_training/${workbookId}`, { headers: authHeader() });
  }

}

export default new DiagramService();
