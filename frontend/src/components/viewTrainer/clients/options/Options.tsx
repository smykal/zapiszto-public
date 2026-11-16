// components/clients/details/informations/ClientOptions.tsx
import React, { useState } from "react";
import Modal from "../../../../constants/Modal";
import { useTranslation } from "react-i18next";
import DeleteClient from "../options/DeleteClient";
import OptionsEditClientName from "./OptionsEditClientName";
import { Client } from "../../../../types/types";

interface Props {
  client: Client;
  onClientDeleted: () => void;
  onClientUpdated: () => void; 
}

const Options: React.FC<Props> = ({ client, onClientDeleted }) => {
  const { t } = useTranslation("global");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // zapobiega otwarciu/zamknięciu Collapsible
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src="/images/navigation/options.svg"
        alt={t("table.options")}
        style={{ cursor: "pointer", width: "24px", height: "24px", marginRight: "0.5rem" }}
        onClick={openModal}
      />
      <Modal show={isModalOpen} onClose={closeModal} title={t("table.options")}>
        <OptionsEditClientName
          client={client}
          onClientUpdated={() => {
            closeModal();
            window.location.reload(); // lub lepiej: zaktualizuj listę klientów w stanie rodzica
          }}
        />
        <DeleteClient
          client={client}
          onClientDeleted={() => {
            onClientDeleted();
            closeModal();
          }}
        />
      </Modal>
    </div>
  );
};

export default Options;
