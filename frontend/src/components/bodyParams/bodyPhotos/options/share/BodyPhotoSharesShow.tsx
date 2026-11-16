import React from "react";
import { BodyPhotoShareDto } from "../../../../../types/types";
import BodyPhotoShare from "./BodyPhotoShare";

interface BodyPhotoSharesShowProps {
  shares: BodyPhotoShareDto[];
  onDelete: (userId: number, bodyPhotoId: string) => void;
}

const BodyPhotoSharesShow: React.FC<BodyPhotoSharesShowProps> = ({ shares, onDelete }) => {
  if (shares.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {shares.map((share, index) => (
        <BodyPhotoShare
          key={`${share.userId}-${index}`}
          share={share}
          onDelete={(userId) => onDelete(userId, share.bodyPhotoShareId)}
        />
      ))}
    </div>
  );
};

export default BodyPhotoSharesShow;
