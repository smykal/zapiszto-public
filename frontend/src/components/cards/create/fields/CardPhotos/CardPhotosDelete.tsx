import React, { useState } from 'react';
import CardService from '../../../../../services/card/CardService';
import Spinner from '../../../../../common/Spinner';

interface Props {
  cardId: string;
  photoId: string;
  onDeleted: () => void;
}

const CardPhotosDelete: React.FC<Props> = ({ cardId, photoId, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    // użyj window.confirm zamiast globalnego confirm by uniknąć eslint error
    const ok = window.confirm('Usuń to zdjęcie?');
    if (!ok) return;

    setLoading(true);
    try {
      await CardService.deletePhoto(cardId, photoId);
      onDeleted();
    } catch (err) {
      console.error('Error deleting photo', err);
      alert('Błąd usuwania zdjęcia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? <Spinner/> : (
        <button type="button" onClick={handleDelete} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}>
          Usuń
        </button>
      )}
    </div>
  );
};

export default CardPhotosDelete;