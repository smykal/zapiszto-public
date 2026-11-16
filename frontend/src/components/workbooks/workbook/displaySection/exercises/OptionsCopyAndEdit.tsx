import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import Modal from "../../../../../constants/Modal";
import ExercisesTrainingService from "../../../../../services/exercises/training/ExercisesTrainingService";
import DictUnitsService from "../../../../../services/dict/DictUnitsService";
import DictQuantityTypeService from "../../../../../services/dict/DictQuantityTypeService";
import { Exercise, DictQuantityType, DictUnits } from "../../../../../types/types";
import { withTranslation } from "react-i18next";
import Spinner from "../../../../../common/Spinner";

type Props = {
  exerciseId: string;
  trainingId: number;
  onExerciseUpdate: () => Promise<void>;
  t: any;
};

const OptionsCopyAndEdit: React.FC<Props> = ({ exerciseId, trainingId, onExerciseUpdate, t }) => {
  const [showModal, setShowModal] = useState(false);
  const [exerciseData, setExerciseData] = useState<Exercise | null>(null);
  const [dictUnits, setDictUnits] = useState<DictUnits[]>([]);
  const [dictQuantityTypes, setDictQuantityTypes] = useState<DictQuantityType[]>([]);
  const [isSaving, setIsSaving] = useState(false); // State to track saving status

  const handleCopyAndEdit = async () => {
    try {
      // 1. Wczytaj słowniki
      const [units, quantityTypes, exerciseResponse] = await Promise.all([
        DictUnitsService.getDictUnits(),
        DictQuantityTypeService.getDictQuantityTypes(),
        ExercisesTrainingService.getExerciseById(exerciseId),
      ]);
      setDictUnits(units.data);
      setDictQuantityTypes(quantityTypes.data);
      setExerciseData(exerciseResponse.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error loading exercise data:", error);
    }
  };

  const handleSubmit = async (values: Exercise) => {
    try {
      setIsSaving(true); // Show spinner
      // 2. Najpierw kopiuj ćwiczenie
      const response = await ExercisesTrainingService.copyExercise(trainingId, exerciseId);
      const newExerciseId = response.data;

      // 3. Potem aktualizuj nową kopię
      await ExercisesTrainingService.updateExercise(newExerciseId, trainingId, values);

      await onExerciseUpdate();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating copied exercise:", error);
    } finally {
      setIsSaving(false); // Hide spinner
    }
  };

  return (
    <>
      <div className="center">
        <button onClick={handleCopyAndEdit}>
          {t("buttons.copy_and_edit")}
        </button>
        <br /><br />
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} title={t("buttons.copy_and_edit")}>
        {exerciseData ? (
          <>
            <div style={{ marginBottom: "1em", textAlign: "center" }}>
              <h2>{exerciseData.dictExerciseName}</h2>
            </div>

            <Formik
              enableReinitialize
              initialValues={{
                ...exerciseData,
                dictQuantityTypeId: exerciseData.dictQuantityTypeId?.toString() || "",
                dictUnitId: exerciseData.dictUnitId?.toString() || ""
              }}
              onSubmit={handleSubmit}>
              <Form>
                <div style={{ display: "grid", gap: "1em", gridTemplateColumns: "1fr 2fr" }}>
                  <Field name="quantity" type="number" />
                  <Field as="select" name="dictQuantityTypeId">
                    <option value="" disabled>{exerciseData.dictQuantityTypeName}</option>
                    {dictQuantityTypes.map((q) => (
                      <option key={q.id} value={q.id}>{q.name}</option>
                    ))}
                  </Field>

                  <Field name="volume" type="number" />
                  <Field as="select" name="dictUnitId">
                    <option value="" disabled>{exerciseData.dictUnitName}</option>
                    {dictUnits.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </Field>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <Field name="notes" type="text" placeholder={t("table.notes")} className="field" />
                  </div>

                  <div style={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    justifyContent: isSaving ? "center" : "flex-end"
                  }}>
                    {isSaving ? (
                      <Spinner />
                    ) : (
                      <button type="submit" className="field">{t("buttons.save")}</button>
                    )}
                  </div>
                </div>
              </Form>
            </Formik>
          </>
        ) : (
          <Spinner />
        )}
      </Modal>
    </>
  );
};

export default withTranslation("global")(OptionsCopyAndEdit);
