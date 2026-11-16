import React, { useState } from "react";
import Modal from "../../../../../constants/Modal";
import { useTranslation } from "react-i18next";

interface ChangeProgramNameProps {
  programId: string;
  currentName: string;
  onSave: (id: string, newName: string) => void;
}

const ChangeProgramName: React.FC<ChangeProgramNameProps> = ({ programId, currentName, onSave }) => {
  const { t } = useTranslation("global");
  const [showModal, setShowModal] = useState(false);
  const [editedName, setEditedName] = useState(currentName);

  const handleSave = () => {
    onSave(programId, editedName);
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)} className="field">
        {t("programs.change_name") || "Change Name"}
      </button>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={t("programs.edit_program_name")}
      >
        <input
          type="text"
          className="field"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
        />
        <br /><br />
        <button
          onClick={handleSave}
          className="field"
          disabled={editedName.trim() === "" || editedName === currentName}
        >
          {t("buttons.save")}
        </button>
      </Modal>
    </div>
  );
};

export default ChangeProgramName;