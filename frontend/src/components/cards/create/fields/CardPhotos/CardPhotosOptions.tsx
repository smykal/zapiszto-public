import React from 'react';
import CardPhotosDelete from './CardPhotosDelete';
import CardPhotosAdd from './CardPhotosAdd';
import { CardPhotoDto } from '../../../../../types/types';
import { withTranslation } from "react-i18next";
import Spinner from '../../../../../common/Spinner';

interface Props {
  cardId: string;
  photos: CardPhotoDto[] | null;
  onClose: () => void;
  onRefresh: () => void;
  t: any;
}

const CardPhotosOptions: React.FC<Props> = ({ photos, cardId, t, onClose, onRefresh }) => {
  return (
    <div style={{ minWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {!photos ? (
          <Spinner />
        ) : photos.length === 0 ? (
          <div>{t("cards.no_photos_added")}</div>
        ) : (
          photos.map((u, idx) => (
            <div
              key={u.id + idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 6,
                background: 'var(--color07)',
                borderRadius: 6,
                gap: 8
              }}
            >
              <img 
              src={u.photoUrl} 
              alt={`thumb-${idx}`} 
              style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }} 
              onContextMenu={(e) => e.preventDefault()}
              />
              {/* spacer zajmuje pozostałą szerokość -> Delete będzie po prawej */}
              <div style={{ flex: 1, minWidth: 0 }} />
              <CardPhotosDelete cardId={cardId} photoId={u.id} onDeleted={() => onRefresh()} />
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: 8 }}>
        {photos && photos.length >= 7 ? (
          <div>{t("cards.too_many_photos")}</div>
        ) : (
          <CardPhotosAdd cardId={cardId} onUploaded={() => onRefresh()} />
        )}
      </div>
    </div>
  );
};

export default withTranslation("global")(CardPhotosOptions);