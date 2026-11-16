import axios from 'axios';
import authHeader from '../auth-header';
import { NewDictCategory } from '../../types/types';
import { API_URL } from '../../constants/api';

class DictCategoryService {
    getDictCategory() {
        return axios.get(API_URL + '/get_category_per_user', { headers: authHeader() });
    }

    getDictCategoryDetails(id: string) {
        return axios.get(API_URL + `/get_dict_category_details/${id}`, { headers: authHeader() });
    }

    updateDictCategoryNameDescription(categoryData: any) {
        return axios.patch(API_URL + '/update_dict_category_name_description', categoryData, { headers: authHeader() });
    }

    postDictCategory(requestBody: NewDictCategory) {
        return axios.post(API_URL + '/add_category', requestBody, { headers: authHeader() });
    }

    deleteDictCategory(itemToDelete: string) {
        return axios.delete(API_URL + '/delete_category/' + itemToDelete, { headers: authHeader() });
    }
}

export default new DictCategoryService();
