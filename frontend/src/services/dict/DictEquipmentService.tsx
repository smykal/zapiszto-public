import axios from 'axios';
import authHeader from '../auth-header';
import { NewDictEquipment, TranslationsDictEquipmentDto } from '../../types/types';

import { API_URL } from '../../constants/api'

class DictEquipmentService {
    getDictEquipment() {
        return axios.get(`${API_URL}/get_equipment_per_user`, { headers: authHeader() });
    }

    postDictEquipmentPerUser(newEquipment: NewDictEquipment) {
        return axios.post(`${API_URL}/add_equipment_per_user`, newEquipment, { headers: authHeader() });
    }

    deleteDictEquipment(equipmentId: string) {
        return axios.delete(`${API_URL}/delete_equipment/${equipmentId}`, { headers: authHeader() });
    }

     getDictEquipmentDetails(equipmentId: string) {
        return axios.get(`${API_URL}/get_equipment_details/${equipmentId}`, { headers: authHeader() });
    }

    updateDictEquipmentTranslations(translations: TranslationsDictEquipmentDto) {
        return axios.patch(`${API_URL}/update_dict_equipment_translations`, translations, { headers: authHeader() });
    }
}
export default new DictEquipmentService();
