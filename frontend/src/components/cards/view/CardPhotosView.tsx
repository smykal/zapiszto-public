import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { CardPhotoDto } from '../../../types/types';

interface Props {
  photos: CardPhotoDto[];
}

const CardPhotosView: React.FC<Props> = ({ photos }) => {
  if (!photos || photos.length === 0) {
    return <div>Brak zdjęć</div>;
  }

  // Sortujemy po orderNumber, jeśli istnieje
  const sortedPhotos = [...photos].sort((a, b) => (a.orderNumber ?? 0) - (b.orderNumber ?? 0));

  return (
    <Swiper
      modules={[Navigation]}
      navigation={true}
      className="mySwiper"
    >
      {sortedPhotos.map((photo, index) => (
        <SwiperSlide key={photo.id || index}>
          <img
            src={photo.photoUrl}
            alt={`photo-${index}`}
            className='card-photo'
            onContextMenu={(e) => e.preventDefault()}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CardPhotosView;
