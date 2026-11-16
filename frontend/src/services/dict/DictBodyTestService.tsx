import axios from 'axios';
import authHeader from '../auth-header';
import { NewDictBodyTest, TranslationsDictBodyTestDto } from '../../types/types';

import { API_URL } from '../../constants/api';

class DictBodyTestService {
    getDictBodyTest() {
        return axios.get(`${API_URL}/get_body_test_per_user`, { headers: authHeader() });
    }

    postDictBodyTest(newBodyTest: NewDictBodyTest) {
        return axios.post(`${API_URL}/add_body_test`, newBodyTest, { headers: authHeader() });
    }

    deleteDictBodyTest(bodyTestId: string) {
        return axios.delete(`${API_URL}/delete_body_test/${bodyTestId}`, { headers: authHeader() });
    }

    getDictBodyTestDetails(bodyTestId: string) {
        return axios.get(`${API_URL}/get_body_test_details/${bodyTestId}`, { headers: authHeader() });
    }

    updateDictBodyTestTranslations(translations: TranslationsDictBodyTestDto) {
        return axios.patch(`${API_URL}/update_dict_body_test_translations`, translations, { headers: authHeader() });
    }
}

export default new DictBodyTestService();
