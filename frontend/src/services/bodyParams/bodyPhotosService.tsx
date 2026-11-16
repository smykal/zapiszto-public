import axios from "axios";
import authHeader from "../auth-header";
import { API_URL } from "../../constants/api";
import { BodyPhotoDto, BodyPhotoEditDateDto } from "../../types/types";

class BodyPhotosService {
  getBodyPhotos(clientId?: string): Promise<BodyPhotoDto[]> {
    const params = clientId ? { clientId } : {};
    return axios
      .get<BodyPhotoDto[]>(`${API_URL}/bodyPhotos`, { headers: authHeader(), params })
      .then((response) => response.data);
  }

  uploadBodyPhoto(file: File, clientId?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (clientId) {
      formData.append("clientId", clientId);
    }
    return axios.post(`${API_URL}/upload-body-photo`, formData, { headers: authHeader() });
  }

  deleteBodyPhoto(bodyPhotoDeleteDto: { photoId: string; photoUrl: string }) {
    return axios.delete(`${API_URL}/delete-body-photo`, {
      headers: authHeader(),
      data: bodyPhotoDeleteDto,
    });
  }

  editPhotoDate(bodyPhotoEditDateDto: BodyPhotoEditDateDto): Promise<void> {
    return axios.patch(`${API_URL}/bodyPhotosEditDate/`, bodyPhotoEditDateDto, {
      headers: authHeader(),
    });
  }
}

export default new BodyPhotosService();