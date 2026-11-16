import axios from 'axios';
import authHeader from '../auth-header';
import { Client, NewClient } from '../../types/types'
import { API_URL } from '../../constants/api'

class ClientsService {
    getClients() {
        return axios.get(API_URL + '/get_clients', { headers: authHeader() })
    }

    getClient(clientId: string) {
        return axios.get(`${API_URL}/get_client/${clientId}`, { headers: authHeader() })
    }

    postNewClient(requestBody: NewClient) {
        return axios.post(API_URL + '/add_client', requestBody, { headers: authHeader() })
            .then(response => {
                console.log('Odpowiedź z serwera:', response.data);
            })
            .catch(error => {
                console.error('Błąd podczas wysyłania zapytania:', error);
            });
    }

    putClient(requestBody: Client) {
        return axios.patch(API_URL + '/update_client', requestBody, { headers: authHeader() })
            .then(response => {
                console.log('Client updated successfully');
                return response.data;
            })
            .catch(error => {
                console.error('Error updating client:', error);
                throw error;
            });
    }

    updateClientUser(clientId: string, userId: number, clientName: string) {
        const requestBody = { id: clientId, userId, clientName };
        return axios.patch(API_URL + '/update_client', requestBody, { headers: authHeader() })
            .then(response => {
                console.log('Odpowiedź z serwera:', response.data);
            })
            .catch(error => {
                console.error('Błąd podczas aktualizacji użytkownika:', error);
            });
    }

    isClientDeletable(clientId: string) {
        return axios.get(`${API_URL}/is_deletable/${clientId}`, { headers: authHeader() })
            .then(response => response.data)
            .catch(error => {
                console.error('Error checking if client is deletable:', error);
                return false;
            });
    }

    deleteClient(clientId: string) {
        return axios.delete(`${API_URL}/delete_client/${clientId}`, { headers: authHeader() })
            .then(response => {
                console.log('Client deleted successfully');
                return response.data;
            })
            .catch(error => {
                console.error('Error deleting client:', error);
                throw error;
            });
    }
}

export default new ClientsService();
