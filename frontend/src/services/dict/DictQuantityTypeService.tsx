import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import { NewDictQuantityType, TranslationsDictQuantityTypeDto } from '../../types/types';

class DictQuantityTypeService {
  getDictQuantityTypes() {
    return axios.get(`${API_URL}/get_quantity_type_per_user`, { headers: authHeader() });
  }

  postDictQuantityTypePerUser(newQuantityType: NewDictQuantityType) {
    return axios.post(`${API_URL}/add_quantity_type_per_user`, newQuantityType, { headers: authHeader() });
  }

  deleteDictQuantityType(quantityTypeId: string) {
    return axios.delete(`${API_URL}/delete_quantity_type/${quantityTypeId}`, { headers: authHeader() });
  }

  getDictQuantityTypeDetails(quantityTypeId: string) {
    return axios.get(`${API_URL}/get_quantity_type_details/${quantityTypeId}`, { headers: authHeader() });
  }

  updateDictQuantityTypeTranslations(translations: TranslationsDictQuantityTypeDto) {
    return axios.patch(`${API_URL}/update_dict_quantity_type_translations`, translations, { headers: authHeader() });
  }
}

export default new DictQuantityTypeService();
