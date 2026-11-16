import axios from 'axios';
import authHeader from '../auth-header';
import { NewDictBodyParam, TranslationsDictBodyParamsDto } from '../../types/types';
import { API_URL } from '../../constants/api';

class DictBodyParamsService {
    getDictBodyParams() {
        return axios.get(`${API_URL}/dictBodyParams`, { headers: authHeader() });
    }

    postDictBodyParam(newBodyParam: NewDictBodyParam) {
        return axios.post(`${API_URL}/add_dict_body_param`, newBodyParam, { headers: authHeader() });
    }

    deleteDictBodyParam(bodyParamId: number) {
        return axios.delete(`${API_URL}/delete_body_param/${bodyParamId}`, { headers: authHeader() });
    }

    getDictBodyParamDetails(bodyParamId: number) {
        return axios.get(`${API_URL}/get_dict_body_param_details/${bodyParamId}`, { headers: authHeader() });
    }

    updateDictBodyParamTranslations(translations: TranslationsDictBodyParamsDto) {
        return axios.patch(`${API_URL}/update_dict_body_param_name_description`, translations, { headers: authHeader() });
    }
}

export default new DictBodyParamsService();
