import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../../../constants/Modal";
import OptionsDelete from "./OptionsDelete";
import OptionsEdit from "./OptionsEdit";
import { Goal } from "../../../../../types/types";

type Props = {
  goal: Goal;
  onGoalUpdated: (updated: Goal) => void;
  onGoalDeleted: (goalId: string) => void;
};

const Options: React.FC<Props> = ({ goal, onGoalUpdated, onGoalDeleted }) => {
  const { t } = useTranslation("global");
  const [isMainModalOpen, setMainModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  return (
    <div>
      <img
        src="/images/navigation/options.svg"
        alt={t("table.options")}
        style={{ cursor: "pointer", width: "24px", height: "24px" }}
        onClick={() => setMainModalOpen(true)}
      />

      <Modal show={isMainModalOpen} onClose={() => setMainModalOpen(false)} title={t("table.options")}>
        <div className="center">
          <button 
          onClick={() => setEditModalOpen(true)} 
          className="buttonEdit width_15rem">
            {t("buttons.edit")}
          </button>
        </div>
        <OptionsDelete
          goalId={goal.id}
          clientId={goal.clientId}
          onGoalDeleted={onGoalDeleted}
          closeModal={() => setMainModalOpen(false)}
        />
      </Modal>

      {isEditModalOpen && (
        <OptionsEdit
          goal={goal}
          onUpdated={(updatedGoal) => {
            onGoalUpdated(updatedGoal);
            setEditModalOpen(false);
            setMainModalOpen(false);
          }}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Options;
