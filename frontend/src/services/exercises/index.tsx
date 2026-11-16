import axios from 'axios';
import authHeader from '../auth-header';
import { NewExercise } from '../../types/types'
import { API_URL } from '../../constants/api'

class ExercisesService {

  postExercise(requestBody: NewExercise, number: number) {
    return axios.post(API_URL + '/add_exercise',
       requestBody,
      { headers: authHeader(), params: { number} })
      .then(response => {
        console.log('Odpowiedź z serwera:', response.data);
      });
  }

  getExercises(trainingId: number) {
    return axios.get(API_URL + '/get_exercise/training/' + trainingId, { headers: authHeader() });
  }

  getExercisesByUserId(trainingId: number, userId: number) {
    return axios.get(`${API_URL}/get_exercise/training/${trainingId}/${userId}`, { headers: authHeader() });
  }

  deleteExercise(trainingId: number,
                 exerciseId: number) {
    return axios.delete(API_URL + '/delete_exercise/' + exerciseId + '/' + trainingId, { headers: authHeader() });
  }
}

export default new ExercisesService()