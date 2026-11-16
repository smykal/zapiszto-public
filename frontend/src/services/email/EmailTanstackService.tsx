import axios from 'axios';
import { API_URL } from '../../constants/api';
import authHeader from '../auth-header';

class EmailTanstackService {
  sendEmail(email: string, subject: string, body: string, attachment: File | null) {
    const formData = new FormData();
    formData.append('to', email);
    formData.append('subject', subject);
    formData.append('body', body);

    if (attachment) {
      formData.append('attachment', attachment);
    }

    return axios.post(API_URL + '/contact', formData, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.error('Error sending email:', error);
        throw error;
      });
  }
}

export default new EmailTanstackService();
