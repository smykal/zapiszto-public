import axios from 'axios';
import authHeader from '../../auth-header';
import { Exercise } from '../../../types/types'
import { API_URL } from '../../../constants/api'

class ExercisesTrainingService {

  getExerciseById(exerciseId: string) {
    return axios.get(API_URL + '/get_exercise/' + exerciseId, { headers: authHeader() });
  }
  
  getLastExerciseTrainingData(exerciseId: string) {
    return axios.get(API_URL + '/get_exercise_data/' + exerciseId, { headers: authHeader() });
  }
  
  deleteExercise(trainingId: number, exerciseId: string) {
    return axios.delete(`${API_URL}/delete_exercise_training/${trainingId}/${exerciseId}`, { headers: authHeader() });
  }

  updateExerciseOrderNumberUp(trainingId: number, exerciseId: string) {
    return axios.patch(`${API_URL}/update_exercise_order_number_up/training/${trainingId}/${exerciseId}`,{}, { headers: authHeader() });
  }

  updateExerciseOrderNumberDown(trainingId: number, exerciseId: string) {
    return axios.patch(`${API_URL}/update_exercise_order_number_down/training/${trainingId}/${exerciseId}`,{}, { headers: authHeader() });
  }

  copyExercise(trainingId: number, exerciseId: string) {
    return axios.post(`${API_URL}/copy_exercise_training/${trainingId}/${exerciseId}`, {}, { headers: authHeader() });
  }

  updateExercise(exerciseId: string, trainingId: number, updatedExerciseTrainingDto: Exercise) {
    return axios.patch(`${API_URL}/update_training_exercise/training/${trainingId}/${exerciseId}`, updatedExerciseTrainingDto, { headers: authHeader() });
  }
}

export default new ExercisesTrainingService();