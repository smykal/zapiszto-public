import React, { useEffect, useState, useCallback } from 'react';
import CardService from '../../../../../services/card/CardService';
import CardPhotosOptions from './CardPhotosOptions';
import Spinner from '../../../../../common/Spinner';
import Modal from '../../../../../constants/Modal';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { CardPhotoDto } from '../../../../../types/types';
import 'swiper/css';
import 'swiper/css/navigation';
import './Swipper.css';

interface Props {
  cardId?: string;
}

const CardPhotos: React.FC<Props> = ({ cardId }) => {
  const { t } = useTranslation('global');
  const [loading, setLoading] = useState<boolean>(true);
  const [photos, setPhotos] = useState<CardPhotoDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const loadPhotos = useCallback(() => {
    if (!cardId) {
      setPhotos([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    CardService.getCardPhotosUrls(cardId)
      .then((resp) => setPhotos(resp.data ?? []))
      .catch((err) => {
        console.error('Error loading photos', err);
        setError('Błąd ładowania zdjęć');
        setPhotos([]);
      })
      .finally(() => setLoading(false));
  }, [cardId]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  if (loading) return <Spinner />;
  if (error) return <div style={{ color: 'var(--color03)' }}>{error}</div>;

  // brak zdjęć - pokaż przycisk obok tekstu (nie ma karuzeli)
  if (photos.length === 0) return (
    <div style={{ flex: '1' }}>
      <div style={{ background: 'var(--color01)', borderRadius: 6, marginBottom: '.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '.5rem' }}>
        <button
          type="button"
          onClick={() => setShowOptions(true)}
          aria-label="Zarządzaj zdjęciami"
          className='icon-button'
        >
          <img src="/images/navigation/edit_white.svg" alt="edit" />
          {t('cards.add_photos')}

        </button>

        <Modal show={showOptions} onClose={() => setShowOptions(false)} title="Zarządzaj zdjęciami">
          {cardId && <CardPhotosOptions cardId={cardId} photos={photos ?? []} onClose={() => { setShowOptions(false); loadPhotos(); }} onRefresh={loadPhotos} />}
        </Modal>
      </div>
    </div>
  );

  return (
    <div style={{ flex: '1' }}>
      <div style={{ background: 'var(--color01)', borderRadius: 6, marginBottom: '.2rem', marginLeft: 'auto', marginRight: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '.5rem', maxWidth: '250px' }}>
        <button
          onClick={() => setShowOptions(true)}
          aria-label="Zarządzaj zdjęciami"
          className="icon-button"
        >
          <img src="/images/navigation/edit_white.svg" alt="manage" />
          {t('cards.manage_photos')}
        </button>
      </div>
      <Swiper
        modules={[Navigation]}
        navigation={true}
        className="mySwiper"
      >
        {photos.map((photo) => (
          <SwiperSlide key={photo.id}>
            <img
              src={photo.photoUrl}
              alt={`photo-${photo.orderNumber ?? photo.id}`}
              className="card-photo"
              onContextMenu={(e) => e.preventDefault()}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Modal show={showOptions} onClose={() => setShowOptions(false)} title="Zarządzaj zdjęciami">
        {cardId && <CardPhotosOptions cardId={cardId} photos={photos} onClose={() => { setShowOptions(false); loadPhotos(); }} onRefresh={loadPhotos} />}
      </Modal>
    </div>
  );
};

export default CardPhotos;