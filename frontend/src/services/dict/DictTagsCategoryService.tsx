import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import { NewDictTagsCategory } from '../../types/types';

class DictTagsCategoryService {
  delete_getDictTagsCategory() {
    return axios.get(`${API_URL}/dict_tags_category`, { headers: authHeader() });
  }

  delete_postDictTagsCategory(newDictTagCategory: NewDictTagsCategory) {
        return axios.post(`${API_URL}/dict_tags_category`, newDictTagCategory, { headers: authHeader() });
    }
}

export default new DictTagsCategoryService();