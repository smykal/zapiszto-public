import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { withTranslation } from "react-i18next";
import Modal from "../../../../../constants/Modal";
import ExercisesTrainingService from "../../../../../services/exercises/training/ExercisesTrainingService";
import { Exercise, DictQuantityType, DictUnits } from "../../../../../types/types";
import DictUnitsService from "../../../../../services/dict/DictUnitsService";
import DictQuantityTypeService from "../../../../../services/dict/DictQuantityTypeService";

type Props = {
    exerciseId: string;
    trainingId: number;
    onExerciseUpdate: () => Promise<void>; // Funkcja do odświeżenia listy
    t: any;
};

const OptionsEdit: React.FC<Props> = ({ exerciseId, trainingId, onExerciseUpdate, t }) => {
    const [showModal, setShowModal] = useState(false);
    const [exerciseData, setExerciseData] = useState<Exercise | null>(null);
    const [dictUnits, setDictUnits] = useState<DictUnits[]>([]);
    const [dictQuantityTypes, setDictQuantityTypes] = useState<DictQuantityType[]>([]);

    useEffect(() => {
        if (showModal) {
            // Pobieramy dane jednostek i typów ilości
            Promise.all([
                DictUnitsService.getDictUnits(),
                DictQuantityTypeService.getDictQuantityTypes(),
            ]).then(([units, quantityTypes]) => {
                setDictUnits(units.data);
                setDictQuantityTypes(quantityTypes.data);
            });

            // Pobieramy aktualne dane ćwiczenia
            ExercisesTrainingService.getExerciseById(exerciseId)
                .then((response) => setExerciseData(response.data))
                .catch((error) => console.error("Error fetching exercise:", error));
        }
    }, [showModal, exerciseId]);

    const handleSubmit = async (values: Exercise) => {
        try {
            await ExercisesTrainingService.updateExercise(exerciseId, trainingId, values);
            await onExerciseUpdate(); // Odświeżenie listy po edycji
            setShowModal(false); // Zamknięcie modala
        } catch (error) {
            console.error("Error updating exercise:", error);
        }
    };

    return (
        <>
            <div>
                <button onClick={() => setShowModal(true)}>
                    {t("buttons.edit")}
                </button>
                {/* <p>{t("buttons.edit_description")}<br/><br/></p> */}
                <br /><br /><br />
            </div>

            <Modal show={showModal} onClose={() => setShowModal(false)} title={t("buttons.edit")}>
                {exerciseData ? (
                    <>
                        {/* Nazwa ćwiczenia i kategoria */}
                        <div style={{ marginBottom: "1em", textAlign: "center" }}>
                            <h3>{exerciseData.dictExerciseName}</h3>
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
                                    {/* Ilość + Typ ilości */}
                                    <Field name="quantity" type="number" />
                                    <Field as="select" name="dictQuantityTypeId">
                                        <option value="" disabled>{exerciseData.dictQuantityTypeName}</option>
                                        {dictQuantityTypes.map((quantity) => (
                                            <option key={quantity.id} value={quantity.id}>
                                                {quantity.name}
                                            </option>
                                        ))}
                                    </Field>

                                    {/* Objętość + Jednostka */}
                                    <Field 
                                    name="volume" 
                                    type="number" 
                                    />
                                    <Field as="select" name="dictUnitId">
                                        <option value="" disabled>
                                            {exerciseData.dictUnitName ? exerciseData.dictUnitName : t("workbooks.select_unit")}
                                        </option>

                                        {dictUnits.map((unit) => (
                                            <option key={unit.id} value={unit.id}>
                                                {unit.name}
                                            </option>
                                        ))}
                                    </Field>

                                    {/* Notatki */}
                                    <div style={{ gridColumn: "1 / -1" }}>
                                        <Field name="notes" type="text" placeholder={t("table.notes")} className='field' />
                                    </div>

                                    {/* Przycisk zapisu */}
                                    <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                                        <button type="submit" className="field">{t("buttons.save")}</button>
                                    </div>
                                </div>
                            </Form>
                        </Formik>
                    </>
                ) : (
                    <p><span className="loader" /></p>
                )}
            </Modal>
        </>
    );
};

export default withTranslation("global")(OptionsEdit);