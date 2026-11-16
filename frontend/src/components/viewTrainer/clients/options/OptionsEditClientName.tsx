import React, { useState } from "react";
import Modal from "../../../../constants/Modal";
import { useTranslation } from "react-i18next";
import ClientsService from "../../../../services/clients";
import { Client } from "../../../../types/types";

interface Props {
  client: Client;
  onClientUpdated: () => void;
}

const OptionsEditClientName: React.FC<Props> = ({ client, onClientUpdated }) => {
  const { t } = useTranslation("global");
  const [showModal, setShowModal] = useState(false);
  const [newClientName, setNewClientName] = useState(client.clientName);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!newClientName.trim()) {
      alert(t("validation.name_required"));
      return;
    }

    setIsLoading(true);
    try {
      await ClientsService.putClient({
        ...client,
        clientName: newClientName,
      });
      onClientUpdated();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating client name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="buttonEdit field"
        style={{ marginBottom: "0.5rem" }}
      >
        {t("clients.edit_client_name")}
      </button>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={t("clients.edit_client_name")}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label> {t("clients.client_assigned_user")} {client.userName}</label>
          <label>
            {t("clients.client_name")}:
            <input
              type="text"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              className="field"
              style={{ width: "100%", marginTop: "0.5rem" }}
            />
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button onClick={() => setShowModal(false)} className="buttonCancel field">
              {t("buttons.cancel")}
            </button>
            <button onClick={handleSave} className="buttonSave field" disabled={isLoading}>
              {isLoading ? t("buttons.saving") : t("buttons.save")}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OptionsEditClientName;
