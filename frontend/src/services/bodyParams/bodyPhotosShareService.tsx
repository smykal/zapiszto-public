import axios from "axios";
import authHeader from "../auth-header";
import { API_URL } from "../../constants/api";
import { BodyPhotoShareDto } from "../../types/types";

class BodyPhotosShareService {

  getBodyPhotoShares(photoId: string) {
    return axios.get<BodyPhotoShareDto[]>(
      `${API_URL}/body_photo_share/${photoId}`,
      { headers: authHeader() }
    );
  }

  shareBodyPhoto(photoId: string, shareToUsers: number[]) {
    return axios.post<void>(
      `${API_URL}/body_photo_share/${photoId}`,
      shareToUsers,
      { headers: authHeader() }
    );
  }

  deleteBodyPhotoShare(bodyPhotoShareId: string, shareUserId: number) {
    return axios.delete(`${API_URL}/body_photo_share/${bodyPhotoShareId}/${shareUserId}`,
      { headers: authHeader() }
    );
  }
}

export default new BodyPhotosShareService();
