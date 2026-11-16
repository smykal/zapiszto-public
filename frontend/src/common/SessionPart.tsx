import React from "react";

interface SessionPartProps {
  purposeId: string;
  purposeName: string;
  size?: number;
}

const SessionPart: React.FC<SessionPartProps> = ({ purposeId, purposeName, size = 18 }) => {
  const iconMap: Record<string, string> = {
    '550e8400-e29b-41d4-a716-446655440003': "/images/icons/warmup.svg",
    '550e8400-e29b-41d4-a716-446655440004': "/images/icons/main.svg",
    '550e8400-e29b-41d4-a716-446655440005': "/images/icons/cooldown.svg",
  };

  const src = iconMap[purposeId];

  if (!src) return null;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={src}
        alt={purposeId}
        width={size}
        height={size}
        style={{ objectFit: "contain" }}
      />
      &nbsp;
      <span style={{ fontSize: size * 0.75 }}>{purposeName}</span>
    </div>
  );
};

export default SessionPart;
