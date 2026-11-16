import React, { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import BodyPhotosService from "../../../../services/bodyParams/bodyPhotosService";
import Spinner from "../../../../common/Spinner";
import { withTranslation } from "react-i18next";
import Modal from "../../../../constants/Modal";

interface Props {
  t: any;
  clientId?: string | null;
  onUploaded: () => void;
}

const BodyPhotosAdd: React.FC<Props> = ({ t, clientId, onUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Wybierz plik");
      return;
    }

    setLoading(true);
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: "image/webp",
      };

      const compressedBlob = await imageCompression(file, options);
      const webpFile = new File(
        [compressedBlob],
        file.name.replace(/\.[^.]+$/, ".webp"),
        { type: "image/webp" }
      );

      await BodyPhotosService.uploadBodyPhoto(webpFile, clientId || undefined);

      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      onUploaded();
      setShowModal(false);
    } catch (err) {
      console.error("Error uploading photo", err);
      alert("Błąd wysyłania zdjęcia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setShowModal(true)} className="button">
        {t("buttons.add")}
      </button>

      <Modal show={showModal} onClose={() => setShowModal(false)} title={t("body_params.add_photo")}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} />
          {loading ? (
            <Spinner />
          ) : (
            <button type="button" onClick={handleUpload} disabled={loading} className="button">
              {t("buttons.add")}
            </button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default withTranslation("global")(BodyPhotosAdd);