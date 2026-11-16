import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import CardService from '../../../../../services/card/CardService';
import Spinner from '../../../../../common/Spinner';
import { useTranslation } from 'react-i18next';


interface Props {
  cardId: string;
  onUploaded: () => void;
}

const CardPhotosAdd: React.FC<Props> = ({ cardId, onUploaded }) => {
  const { t } = useTranslation('global');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) {
      alert((t('buttons.select_file')));
      return;
    }

    setLoading(true);
    try {
      // 🔹 Ustawienia kompresji i konwersji do WebP
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: 'image/webp', // konwersja do WebP
      };

      // 🔹 Kompresja — UWAGA: wynik to Blob
      const compressedBlob = await imageCompression(file, options);

      // 🔹 Tworzymy nowy File z nazwą i typem
      const webpFile = new File(
        [compressedBlob],
        file.name.replace(/\.[^.]+$/, '.webp'),
        { type: 'image/webp' }
      );

      // 🔹 Wysyłamy plik WebP na backend
      await CardService.uploadPhoto(cardId, webpFile);

      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      onUploaded();
    } catch (err) {
      console.error('Error uploading photo', err);
      alert('Błąd wysyłania zdjęcia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} />
      {loading ? <Spinner /> :
        <button type="button" onClick={handleUpload} disabled={loading} className="field">
          {t('buttons.add')}
        </button>
      }
    </div>
  );
};

export default CardPhotosAdd;
