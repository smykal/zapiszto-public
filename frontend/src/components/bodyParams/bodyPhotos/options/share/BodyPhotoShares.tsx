import React, { useEffect, useState } from "react";
import Spinner from "../../../../../common/Spinner";
import BodyPhotoSharesShow from "./BodyPhotoSharesShow";
import BodyPhotosShareService from "../../../../../services/bodyParams/bodyPhotosShareService";
import { BodyPhotoShareDto } from "../../../../../types/types";
import Modal from "../../../../../constants/Modal";
import BodyPhotoSharesAdd from "./BodyPhotoSharesAdd";
import { withTranslation } from "react-i18next";

interface BodyPhotoSharesProps {
  photoId: string;
  t: any;
}

const BodyPhotoShares: React.FC<BodyPhotoSharesProps> = ({ photoId, t }) => {
  const [shares, setShares] = useState<BodyPhotoShareDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const loadShares = async () => {
    try {
      setLoading(true);
      const response = await BodyPhotosShareService.getBodyPhotoShares(photoId);
      setShares(response.data);
    } catch (error) {
      console.error("Failed to load body photo shares", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShares();
  }, [photoId]);

  const deleteShare = async (userId: number, photoId: string) => {
    try {
      await BodyPhotosShareService.deleteBodyPhotoShare(photoId, userId);
      setShares(prev => prev.filter(share => share.userId !== userId));
    } catch (error) {
      console.error("Failed to delete share", error);
    }
  };


  const saveShares = async (userIds: number[]) => {
    try {
      setLoading(true);
      await BodyPhotosShareService.shareBodyPhoto(photoId, userIds);
      await loadShares(); // 🔁 odśwież listę
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to share body photo", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <BodyPhotoSharesShow shares={shares} onDelete={deleteShare} />

      <button onClick={() => setIsModalOpen(true)}>
        {t("buttons.share")}
      </button>

      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("buttons.share")}
      >
        <BodyPhotoSharesAdd
          photoId={photoId}
          onUsersSelected={saveShares}
        />
      </Modal>
    </div>
  );
};

export default withTranslation("global")(BodyPhotoShares);
