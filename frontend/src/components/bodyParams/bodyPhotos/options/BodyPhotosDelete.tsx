import React, { useState } from "react";
import BodyPhotosService from "../../../../services/bodyParams/bodyPhotosService";
import Spinner from "../../../../common/Spinner";
import { useTranslation } from "react-i18next";
import binIcon from "../../../../assets/bin.svg";

const iconStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  cursor: "pointer",
  filter: "invert(78%) sepia(91%) saturate(748%) hue-rotate(340deg) brightness(91%) contrast(88%)", // Red color overlay
};

interface Props {
  photoId: string;
  photoUrl: string;
  onDeleted: () => void;
}

const BodyPhotosDelete: React.FC<Props> = ({ photoId, photoUrl, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation("global");

  const handleDelete = async () => {
    const ok = window.confirm("Usuń to zdjęcie?");
    if (!ok) return;

    setLoading(true);
    try {
      await BodyPhotosService.deleteBodyPhoto({ photoId, photoUrl });
      onDeleted();
    } catch (err) {
      console.error("Error deleting photo", err);
      alert("Błąd usuwania zdjęcia");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <img
          src={binIcon}
          alt={t("buttons.delete")}
          style={iconStyle}
          onClick={handleDelete}
          title={t("buttons.delete")}
        />
      )}
    </div>
  );
};

export default BodyPhotosDelete;