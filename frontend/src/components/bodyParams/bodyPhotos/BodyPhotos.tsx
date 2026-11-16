import React, { useEffect, useState, useCallback } from "react";
import BodyPhotosService from "../../../services/bodyParams/bodyPhotosService";
import BodyPhotosOptions from "./options/BodyPhotosOptions";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { BodyPhotoDto } from "../../../types/types";
import Spinner from "../../../common/Spinner";
import "swiper/css";
import "swiper/css/navigation";

interface Props {
  clientId?: string; // Optional clientId prop
}

const BodyPhotos: React.FC<Props> = ({ clientId }) => {
  const [photos, setPhotos] = useState<BodyPhotoDto[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const photos = await BodyPhotosService.getBodyPhotos(clientId);
      setPhotos(photos);
    } catch (error) {
      console.error("Error fetching body photos:", error);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  if (loading) {
    return <Spinner />;
  }

  if (!photos || photos.length === 0) {
    return (
      <div style={{ flex: "1" }}>
        <BodyPhotosOptions photos={photos} onRefresh={fetchPhotos} />
      </div>
    );
  }

  return (
    <div style={{ flex: "1" }}>
      <Swiper modules={[Navigation]} navigation={true} className="mySwiper">
        {photos.map((photo) => (
          <SwiperSlide key={photo.id}>
            <img
              src={photo.photoUrl}
              alt={`${photo.id}`}
              className="card-photo"
              onContextMenu={(e) => e.preventDefault()}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <BodyPhotosOptions photos={photos} clientId={clientId} onRefresh={fetchPhotos} />
    </div>
  );
};

export default BodyPhotos;