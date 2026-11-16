import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api'
import {NewTraining, TrainingDate, TrainingNotes } from '../../types/types';

class TrainingsService {

  deleteTraining(id: number) {
    return axios.delete(API_URL + '/delete_training/' + id, { headers: authHeader() })
      .then(response => {
        console.log('Training deleted successfully');
        return response.data;
      })
      .catch(error => {
        console.error('Error deleting training:', error);
        throw error;
      });
  }

  copyTraining(trainingId: number) {
    return axios.post(`${API_URL}/copy_training/${trainingId}`, {}, { headers: authHeader() });
  }

  postNewTraining(workbookId: number, date: Date){
      const requestBody: NewTraining = {
        workbook_id: workbookId,
        date: date
      }
      return axios.post(API_URL + '/add_training', requestBody, { headers: authHeader() })
        .then(response => {
          console.log('Odpowiedź z serwera:', response.data);
        })
        .catch(error => {
          console.error('Błąd podczas wysyłania zapytania:', error);
        });
    }
  
    getTrainings(workbookId: number) {
      return axios.get(API_URL + '/get_trainings/workbook/' + workbookId, { headers: authHeader() });
    }
  
    getTrainingsByUserId(workbookId: number, userId: number) {
      return axios.get(`${API_URL}/get_trainings/workbook/${workbookId}/${userId}`, { headers: authHeader() });
    }
  
    patchTrainingNotes(id: number, notes: string){
      const requestBody: TrainingNotes = {
        id: id,
        notes: notes
      }
      return axios.patch(API_URL + '/patch_trening_notes', requestBody, { headers: authHeader() })
      .then(response => {
        console.log('Odpowiedź z serwera:', response.data);
      })
      .catch(error => {
        console.error('Błąd podczas wysyłania zapytania:', error);
      });
    }

    patchTrainingDate(id: number, date: string) {
      const requestBody: TrainingDate = {
        id,
        date
      };
      return axios.patch(API_URL + '/patch_training_date', requestBody, { headers: authHeader() });
    }

}

export default new TrainingsService()