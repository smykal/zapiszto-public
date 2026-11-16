import React from "react";
import BodyPhotosDelete from "./BodyPhotosDelete";
import BodyPhotosAdd from "./BodyPhotosAdd";
import BodyPhotosDate from "./BodyPhotosDate";
import BodyPhotoShares from "./share/BodyPhotoShares";
import Spinner from "../../../../common/Spinner";
import { BodyPhotoDto } from "../../../../types/types";
import { useTranslation } from "react-i18next";
import BodyPhotoTags from "./tags/BodyPhotoTags";
import ShowComments from "../../../comments/ShowComments";

interface BodyPhotosOptionsProps {
  photos: BodyPhotoDto[] | null;
  clientId?: string;
  onRefresh: () => void;
}

const BodyPhotosOptions: React.FC<BodyPhotosOptionsProps> = ({ clientId, photos, onRefresh }) => {
  const { t } = useTranslation("global");

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: ".7rem", marginTop: "1rem" }}>
        {!photos ? (
          <Spinner />
        ) : photos.length === 0 ? (
          <div>{t("cards.no_photos_added")}</div>
        ) : (
          photos.map((p, idx) => {
            return (
              <div
                key={p.id + idx}
                style={{
                  display: "flex",
                  padding: 6,
                  background: "var(--color04)",
                  borderRadius: 6,
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    flex: "0 0 40%",
                    maxWidth: "15rem",
                    position: "relative", // 👈 KLUCZ
                  }}
                >
                  <img
                    src={p.photoUrl}
                    alt={`${idx}`}
                    style={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: 4 }}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 6,
                      left: 6,
                      zIndex: 3, // Zwiększono z-index dla przycisku usuwania
                      background: "rgba(0,0,0,0.4)",
                      backdropFilter: "blur(4px)",
                      borderRadius: 6,
                      padding: "4px 6px",
                    }}
                  >
                    <BodyPhotosDelete
                      photoId={p.id}
                      photoUrl={p.photoUrl}
                      onDeleted={() => onRefresh()}
                    />
                  </div>
                </div>
                <div style={{ flex: "1" }}>
                  <BodyPhotoTags photoId={p.id} />
                  <BodyPhotoShares photoId={p.id} />
                  <BodyPhotosDate
                      photo={p}
                      onRefresh={() => onRefresh()}
                    />
                  <ShowComments origin="body_photos" originId={p.id} />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div>
        {photos && photos.length >= 15 ? (
          <div>{t("cards.too_many_photos")}</div>
        ) : (
          <BodyPhotosAdd clientId={clientId} onUploaded={() => onRefresh()} />
        )}
      </div>
    </div>
  );
};

export default BodyPhotosOptions;