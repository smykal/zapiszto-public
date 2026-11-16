import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import { CardStatusDto, DictCardStatusDto } from '../../types/types';

class CardStatusService {
  /**
   * GET /v1/cardStatusActual
   * Zwraca aktualny status karty użytkownika
   */
  async getCardStatusActual(cardId: string): Promise<CardStatusDto> {
    const response = await axios.get(`${API_URL}/cardStatusActual/${cardId}`, {
      headers: authHeader(),
    });
    return response.data;
  }

  /**
   * GET /v1/cardStatus
   * Zwraca listę statusów dostępnych dla użytkownika (słownik)
   */
  async getCardStatusesAllowedToDo(cardId: string): Promise<DictCardStatusDto[]> {
    const response = await axios.get(`${API_URL}/cardStatus/${cardId}`, {
      headers: authHeader(),
    });
    return response.data;
  }

  /**
   * POST /v1/cardStatus
   * Wysyła zmianę statusu karty
   */
  async postCardStatus(cardStatusDto: CardStatusDto): Promise<void> {
    await axios.post(`${API_URL}/cardStatus`, cardStatusDto, {
      headers: authHeader(),
    });
  }
}

export default new CardStatusService();
