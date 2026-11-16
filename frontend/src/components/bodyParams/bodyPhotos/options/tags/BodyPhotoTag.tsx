import React from "react";

interface BodyPhotoTagProps {
  tagId: string;
  name: string;
  onDelete: (tagId: string) => void;
}

const BodyPhotoTag: React.FC<BodyPhotoTagProps> = ({ tagId, name, onDelete }) => {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "1px 4px 3px 6px",
        background: "#e6f0ff",
        borderRadius: 16,
        fontSize: 13,
        color: "#1a3d7c",
        border: "1px solid #c9dbff",

      }}
    >
      {name}
      <span
        onClick={() => onDelete(tagId)}
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

export default BodyPhotoTag;
