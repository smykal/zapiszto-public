import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import { NewDictTagsDto } from '../../types/types';
import { TranslationsDictTagsDto } from '../../types/types';

class DictTagsService {
    delete_getDictTags() {
        return axios.get(`${API_URL}/get_tags_basic`, { headers: authHeader() });
    }   
    delete_getDictTagsForBodyPhoto(photoId: string) {
        return axios.get(`${API_URL}/get_tags_basic_for_body_photo/${photoId}`, { headers: authHeader() });
    }   

    delete_getDictTagsDetails(dictTagId: string) {
        return axios.get(`${API_URL}/get_tags_basic/${dictTagId}`, { headers: authHeader() });
    }

    delete_postDictTag(newDictTag: NewDictTagsDto) {
        return axios.post(`${API_URL}/add_tags_basic`, newDictTag, { headers: authHeader() });
    }

    delete_deleteDictTag(itemToDelete: string) {
        return axios.delete(`${API_URL}/dict_tag/${itemToDelete}`, { headers: authHeader() });
    }

    delete_updateDictTagTranslations(translations: TranslationsDictTagsDto) {
        return axios.patch(`${API_URL}/update_dict_quantity_type_translations`, translations, { headers: authHeader() });
  }}

export default new DictTagsService();