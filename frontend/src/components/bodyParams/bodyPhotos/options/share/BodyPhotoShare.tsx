
import React from "react";
import { BodyPhotoShareDto } from "../../../../../types/types";

interface BodyPhotoShareProps {
  share: BodyPhotoShareDto;
  onDelete: (userId: number, bodyPhotoId: string) => void;
}

const BodyPhotoShare: React.FC<BodyPhotoShareProps> = ({ share, onDelete }) => {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 8px",
        background: "#e8ffe6",
        borderRadius: 16,
        fontSize: 13,
        color: "#1f7a1f",
        border: "1px solid #b6e3b6"
      }}
      title={`Shared with user ${share.userId}`}
    >
      {share.name}
       <span
        onClick={() => onDelete(share.userId, share.bodyPhotoShareId)}
        style={{
          cursor: "pointer",
          fontWeight: "bold",
          opacity: 0.6
        }}
        title="Remove tag"
      >
        ×
      </span>
    </span>
  );
};

export default BodyPhotoShare;
