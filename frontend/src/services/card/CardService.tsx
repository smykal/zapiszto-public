import axios from 'axios';
import authHeader from '../auth-header';
import { CardDto, CardViewDto, CardPhotoDto } from '../../types/types';
import { API_URL } from '../../constants/api';

class CardService {
  setUpCard() {
    return axios.get<CardDto>(`${API_URL}/card/set_up_card`, { headers: authHeader() });
  }

  // fetch card for current user
  getCardByUser() {
    return axios.get<CardDto>(`${API_URL}/card`, { headers: authHeader() });
  }

  viewCard() {
    return axios.get<CardViewDto>(`${API_URL}/viewCard`, { headers: authHeader() });
  }

  getCards() {
    const headers = authHeader();
    const config = headers ? { headers } : {};

    return axios.get<CardViewDto[]>(`${API_URL}/viewCards`, config);
  }

  createCard(cardDto: CardDto) {
    return axios.post(`${API_URL}/new_card`, cardDto, { headers: authHeader() });
  }

  patchCard(cardId: string, updatedFields: Partial<CardDto>) {
    return axios.patch(`${API_URL}/card/${cardId}`, updatedFields, { headers: authHeader() });
  }

  getCardPhotosUrls(cardId: string) {
    return axios.get<CardPhotoDto[]>(
      `${API_URL}/cardPhotos/${cardId}`,
      { headers: authHeader() }
    );
  }

  uploadPhoto(cardId: string, file: File) {
    const form = new FormData();
    form.append('file', file);
    const headers = { ...authHeader(), 'Content-Type': 'multipart/form-data' };
    return axios.post<string>(`${API_URL}/upload-photo/${cardId}`, form, { headers });
  }

  deletePhoto(cardId: string, photoUrl: string) {
    const headers = { ...authHeader(), 'Content-Type': 'application/json' };
    return axios.delete<string>(`${API_URL}/delete-photo/${cardId}`, {
      headers,
      data: JSON.stringify(photoUrl)
    });
  }

  deleteAddress(addressId: string) {
    return axios.delete<string>(`${API_URL}/deleteAddress/${addressId}`, { headers: authHeader() });
  }
}

export default new CardService();