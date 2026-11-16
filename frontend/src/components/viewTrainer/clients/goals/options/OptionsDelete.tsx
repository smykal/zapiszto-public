import React from "react";
import { useTranslation } from "react-i18next";
import { useDeleteGoal } from "../../../../../services/goals/GoalsTanstackService";

type Props = {
  goalId: string;
  clientId: string;
  onGoalDeleted: (goalId: string) => void;
  closeModal: () => void;
};

const OptionsDelete: React.FC<Props> = ({ goalId, clientId, onGoalDeleted, closeModal }) => {
  const { t } = useTranslation("global");
  const deleteGoal = useDeleteGoal();

  const handleDelete = async () => {
    if (window.confirm(t("buttons.delete_confirm"))) {
      try {
        await deleteGoal.mutateAsync({ goalId, clientId });
        onGoalDeleted(goalId);
        closeModal();
      } catch (error) {
        console.error("Błąd podczas usuwania celu:", error);
      }
    }
  };

  return (
    <div className="center">
      <button onClick={handleDelete} className="buttonDelete width_15rem">
        {t("buttons.delete")}
      </button>
    </div>
  );
};

export default OptionsDelete;
