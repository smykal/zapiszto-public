import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';

class DictCountryService {
    getDictCountry() {
        return axios.get(API_URL + '/get_countries', { headers: authHeader() });
    }
}
export default new DictCountryService();