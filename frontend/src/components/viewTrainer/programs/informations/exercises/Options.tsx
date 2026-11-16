import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import Modal from "../../../../../constants/Modal";
import OptionsDelete from "./OptionsDelete";
import OptionsEdit from "./OptionsEdit";
import { ExerciseSession, DictSessionPartDto, DictCategories, DictQuantityType, DictUnits, DictEquipment } from "../../../../../types/types";
import OptionsMove from "./OptionsMove";

type Props = {
  exerciseId: string;
  sessionId: string;
  exerciseData: ExerciseSession;
  sessionPartOptions: DictSessionPartDto[];
  categoriesOptions: DictCategories[];
  quantityTypeOptions: DictQuantityType[];
  unitsOptions: DictUnits[];
  equipmentOptions: DictEquipment[];
  onExerciseOption: (updated: ExerciseSession[] | ((prev: ExerciseSession[]) => ExerciseSession[])) => void;
  t: any;
};

const Options: React.FC<Props> = ({
  exerciseId,
  sessionId,
  onExerciseOption,
  exerciseData,
  sessionPartOptions,
  categoriesOptions,
  quantityTypeOptions,
  unitsOptions,
  equipmentOptions, 
  t,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      <img
        src="/images/navigation/options.svg"
        alt="Options"
        style={{ cursor: "pointer", width: "24px", height: "24px" }}
        onClick={() => setShowModal(true)}
      />

      <Modal show={showModal} onClose={() => setShowModal(false)} title={t("table.options")}>
        <div className="center">
          <OptionsMove
            exerciseId={exerciseId}
            sessionId={sessionId}
            onExerciseOption={onExerciseOption}
          />

          <OptionsEdit
            exercise={exerciseData}
            sessionPartOptions={sessionPartOptions}
            categoriesOptions={categoriesOptions}
            quantityTypeOptions={quantityTypeOptions}
            unitsOptions={unitsOptions}
            equipmentOptions={equipmentOptions}
            onSave={(updatedFields) => {
              onExerciseOption((prevExercises: ExerciseSession[]) =>
                prevExercises.map((ex) =>
                  ex.exerciseId === updatedFields.exerciseId ? { ...ex, ...updatedFields } : ex
                )
              );
              setShowModal(false);
            }}
          />
          <br />

          <OptionsDelete
            exerciseId={exerciseId}
            sessionId={sessionId}
            onExerciseOption={(updated) => {
              onExerciseOption(updated);
              setShowModal(false);
            }}
          />

        </div>
      </Modal>
    </div>
  );
};

export default withTranslation("global")(Options);
