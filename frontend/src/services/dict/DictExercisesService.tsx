import axios from 'axios';
import authHeader from '../auth-header';
import { API_URL } from '../../constants/api';
import { NewDictExercises, TranslationsDictExercisesDto } from '../../types/types';

class DictExercisesService {
    getDictExercises() {
        return axios.get(API_URL + '/get_exercises_per_user', { headers: authHeader() });
    }

    getDictExerciseDetails(id: string) {
        return axios.get<TranslationsDictExercisesDto>(API_URL + `/get_dict_exercise_per_user_details/${id}`, { headers: authHeader() });
    }

    postDictExercisePerUser(newDictExercise: NewDictExercises) {
        return axios.post(API_URL + '/add_exercise_per_user', newDictExercise, { headers: authHeader() });
    }

    deleteDictExercise(itemId: string) {
        return axios.delete(API_URL + `/delete_exercise/${itemId}`, { headers: authHeader() });
    }

    updateDictExerciseName(translationsDto: TranslationsDictExercisesDto) {
        return axios.patch(API_URL + '/update_dict_exercise_name', translationsDto, { headers: authHeader() });
    }
}

export default new DictExercisesService();
