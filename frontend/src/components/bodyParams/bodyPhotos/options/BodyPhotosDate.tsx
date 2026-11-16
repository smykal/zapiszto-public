import React, { useState } from "react";
import { BodyPhotoDto } from "../../../../types/types";
import Modal from "../../../../constants/Modal";
import BodyPhotosService from "../../../../services/bodyParams/bodyPhotosService";
import { useTranslation } from "react-i18next";

interface BodyPhotosDateProps {
  photo: BodyPhotoDto;
  onRefresh: () => void;
}

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "4px 8px",
  background: "#e6f0ff",
  borderRadius: 16,
  fontSize: 13,
  color: "#1a3d7c",
  border: "1px solid #c9dbff"
};

const BodyPhotosDate: React.FC<BodyPhotosDateProps> = ({ photo, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDate, setNewDate] = useState(photo.date ? photo.date.split("T")[0] : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation("global");

  const handleEdit = async () => {
    setIsSubmitting(true);
    try {
      await BodyPhotosService.editPhotoDate({ id: photo.id, date: newDate });
      setIsModalOpen(false);
      onRefresh();
    } catch (error) {
      console.error("Error updating photo date:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* BADGE Z DATĄ */}
      <span style={badgeStyle}>
        {photo.date
          ? new Date(photo.date).toLocaleDateString()
          : t("labels.no_date")}

        {/* DYSKRETNA IKONA EDYCJI */}
        <span
          onClick={() => setIsModalOpen(true)}
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            opacity: 0.6,
            zIndex: 10, // Dodano z-index, aby upewnić się, że ikona jest klikalna
            position: "relative" // Dodano pozycjonowanie, aby z-index działał poprawnie
          }}
          title={t("buttons.edit")}
        >
          ✎
        </span>
      </span>

      {/* MODAL */}
      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("modals.edit_photo_date")}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <label>
            {t("labels.new_date")}
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </label>

          <button onClick={handleEdit} disabled={isSubmitting}>
            {isSubmitting ? t("buttons.saving") : t("buttons.save")}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default BodyPhotosDate;
