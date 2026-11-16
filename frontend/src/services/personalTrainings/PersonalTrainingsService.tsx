import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api'

class PersonalTrainingsService { 

    getClientProgramByClientId(clientId: string) {
        return axios.get(`${API_URL}/get_client_program/${clientId}`, { headers: authHeader() });
      }

    getClientProgramByUserId() {
      return axios.get(`${API_URL}/get_client_program`, { headers: authHeader() });
    }

}
export default new PersonalTrainingsService();