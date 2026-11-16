import axios from 'axios';
import authHeader from '../auth-header';
import { NewDictUnit, TranslationsDictUnitDto } from '../../types/types';

import { API_URL } from '../../constants/api'

class DictUnitsService {
    getDictUnits() {
        return axios.get(`${API_URL}/get_units_per_user`, { headers: authHeader() });
    }

    postDictUnit(newUnit: NewDictUnit) {
        return axios.post(`${API_URL}/add_units`, newUnit, { headers: authHeader() });
    }

    deleteDictUnit(unitId: string) {
        return axios.delete(`${API_URL}/delete_unit/${unitId}`, { headers: authHeader() });
    }

    getDictUnitDetails(unitId: string) {
        return axios.get(`${API_URL}/get_unit_details/${unitId}`, { headers: authHeader() });
    }

    updateDictUnitTranslations(translations: TranslationsDictUnitDto) {
        return axios.patch(`${API_URL}/update_dict_unit_translations`, translations, { headers: authHeader() });
    }
}

export default new DictUnitsService();
