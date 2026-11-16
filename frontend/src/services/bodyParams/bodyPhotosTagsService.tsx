import axios from "axios";
import authHeader from "../auth-header";
import { API_URL } from "../../constants/api";
import { BodyPhotoTagsDto, TagDto } from "../../types/types";

class BodyPhotosTagsService {
    getBodyPhotoTags(bodyPhotoId: string) {
        return axios.get<BodyPhotoTagsDto>(`${API_URL}/body_photos_tags/${bodyPhotoId}`, { headers: authHeader() });
    }

     addBodyPhotoTags(photoId: string, tags: TagDto[]) {
        return axios.post(
            `${API_URL}/body_photo_tags/${photoId}`,
            tags,
            { headers: authHeader() }
        );
    }

    deleteBodyPhotoTag(photoId: string, tagId: string) {
    return axios.delete(`${API_URL}/body_photo_tag/${photoId}/${tagId}`,
      { headers: authHeader() }
    );
  }
}


export default new BodyPhotosTagsService();