import React, { useState, useEffect } from "react";
import { ExerciseSession, DictCategories, DictExercises, DictSessionPartDto, DictQuantityType, DictUnits, DictEquipment } from "../../../../../types/types";
import Modal from "../../../../../constants/Modal";
import { useTranslation } from "react-i18next";
import ExercisesSessionService from "../../../../../services/exercises/session/ExercisesSessionService";
import DictExercisesService from "../../../../../services/dict/DictExercisesService";

type Props = {
  exercise: ExerciseSession;
  sessionPartOptions: DictSessionPartDto[];
  categoriesOptions: DictCategories[];
  quantityTypeOptions: DictQuantityType[];
  unitsOptions: DictUnits[];
  equipmentOptions: DictEquipment[];
  onSave: (updatedExercise: ExerciseSession) => void;
};

const OptionsEdit: React.FC<Props> = ({
  exercise,
  sessionPartOptions,
  categoriesOptions,
  quantityTypeOptions,
  unitsOptions,
  equipmentOptions,
  onSave
}) => {
  const { t } = useTranslation("global");
  const [show, setShow] = useState(false);

  const [sessionPartId, setSessionPartId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [exerciseId, setExerciseId] = useState<string>("");
  const [quantityTypeId, setQuantityTypeId] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const [equipmentId, setEquipmentId] = useState<string>("");
  const [exercisesList, setExercisesList] = useState<DictExercises[]>([]);
  const [notes, setNotes] = useState(exercise.notes || "");
  const [equipmentAttribute, setEquipmentAttribute] = useState(exercise.equipmentAttribute || "");
  const [sets, setSets] = useState(exercise.sets || 0);
  const [tempo, setTempo] = useState(exercise.tempo || "");
  const [restTime, setRestTime] = useState<number | null>(exercise.restTime ?? null);
  const [volume, setVolume] = useState<number | null>(exercise.volume ?? null);
  const [quantity, setQuantity] = useState(exercise.quantity ?? null);
  const [duration, setDuration] = useState<number | null>(exercise.duration ?? null);

  useEffect(() => {
    setSessionPartId(exercise.dictSessionPartId ?? "");
    setCategoryId(exercise.dictCategoryId ?? "");
    setExerciseId(exercise.dictExerciseId ?? "");
    setQuantityTypeId(exercise.dictQuantityTypeId ?? "");
    setUnitId(exercise.dictUnitNameId ?? "");
    setEquipmentId(exercise.dictEquipmentId ?? "");
  }, [exercise]);

  useEffect(() => {
  // Nie ładuj nic, dopóki nie otworzono modala i nie zmieniono kategorii
  if (!show) return;

  if (categoryId) {
    DictExercisesService.getDictExercises()
      .then((res) => {
        const filtered = res.data.filter((ex: DictExercises) => ex.category_id === categoryId);
        setExercisesList(filtered);

        if (!exerciseId && exercise.dictExerciseId) {
          setExerciseId(exercise.dictExerciseId);
        }
      })
      .catch((err) => console.error("Błąd ładowania ćwiczeń:", err));
  }
  // UWAGA: nie czyścimy exerciseId gdy categoryId === ""
}, [categoryId, show]);

  const handleSave = () => {
    const updatedData: ExerciseSession = {
      ...exercise,
      dictExerciseId: exerciseId || exercise.dictExerciseId,
      dictExerciseName:
        exercisesList.find((e) => e.id === (exerciseId || exercise.dictExerciseId))?.name ||
        exercise.dictExerciseName,
      dictSessionPartId: sessionPartId || exercise.dictSessionPartId,
      dictCategoryId: categoryId || exercise.dictCategoryId,
      dictQuantityTypeId: quantityTypeId || exercise.dictQuantityTypeId,
      dictUnitNameId: unitId || exercise.dictUnitNameId,
      dictEquipmentId: equipmentId || exercise.dictEquipmentId,
      notes,
      sets,
      tempo,
      restTime,
      volume,
      quantity,
      duration,
      equipmentAttribute,
    };
    
    ExercisesSessionService.updateExerciseSession(exercise.exerciseId, updatedData)
      .then(() => {
        onSave(updatedData);
        setShow(false);
      })
      .catch((error) => console.error("Błąd przy zapisie zmian:", error));
  };

  return (
    <>
      <button onClick={() => setShow(true)} style={{ margin: "0.5rem" }}>
        {t("buttons.edit")}
      </button>
      <Modal show={show} onClose={() => setShow(false)} title={t("buttons.edit")}>
        <div className="modal-grid">

          <span>{t("table.session_part")}:</span>
          <select value={sessionPartId} onChange={e => setSessionPartId(e.target.value)}>
            <option value="" disabled hidden>{exercise.dictSessionPartName || t("select.choose_session_part")}</option>
            {sessionPartOptions.map((part) => (
              <option key={part.id} value={part.id}>{part.name}</option>
            ))}
          </select>

          <span>{t("table.category")}:</span>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="" disabled hidden>{exercise.dictCategoryName || t("select.choose_category_part")}</option>
            {categoriesOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <span>{t("table.exercise")}:</span>
          <select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
            <option value="" disabled hidden>{exercise.dictExerciseName || t("select.choose_exercise")}</option>
            {exercisesList.map((ex) => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>

          <span>{t("table.weight")}:</span>
          <div className="modal-grid">
            <input
              type="number"
              value={volume === null ? "" : volume}
              onChange={e => {
                const val = e.target.value;
                setVolume(val === "" ? null : Number(val));
              }}
            />
            <select value={unitId} onChange={e => setUnitId(e.target.value)}>
              <option value="" disabled hidden>{exercise.dictUnitName || t("select.choose_unit")}</option>
              {unitsOptions.map((part) => (
                <option key={part.id} value={part.id}>{part.name}</option>
              ))}
            </select>

          </div>
          <span>{t("table.quantity")}:</span>

          <div className="modal-grid">
            <input
              type="number"
              value={quantity === null ? "" : quantity}
              onChange={e => {
                const val = e.target.value;
                setQuantity(val === "" ? null : Number(val));
              }}
            />
            <select value={quantityTypeId} onChange={(e) => setQuantityTypeId(e.target.value)}>
              <option value="" disabled hidden>{exercise.dictQuantityTypeName || t("select.choose_quantity_type")}</option>
              {quantityTypeOptions.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
          </div>

          <span>{t("table.sets")}:</span>
          <input type="number" value={sets} onChange={(e) => setSets(Number(e.target.value))} />

          <span>{t("table.notes")}:</span>
          <input value={notes} onChange={(e) => setNotes(e.target.value)} />

          <span>{t("table.rest_time")}:</span>
          <input
            type="number"
            value={restTime === null ? "" : restTime}
            onChange={e => {
              const val = e.target.value;
              setRestTime(val === "" ? null : Number(val));
            }}
          />

          <span>{t("table.tempo")}:</span>
          <input value={tempo} onChange={(e) => setTempo(e.target.value)} />

          <span>{t("table.equipment")}:</span>
          <select value={equipmentId} onChange={e => setEquipmentId(e.target.value)}>
            <option value="" disabled hidden>{exercise.equipmentName || t("table.select_equipment")}</option>
            {equipmentOptions.map((eq) => (
              <option key={eq.id} value={eq.id}>{eq.name}</option>
            ))}
          </select>

          <span>{t("table.equipment_attribute")}:</span>
          <input value={equipmentAttribute} onChange={e => setEquipmentAttribute(e.target.value)} />

          <span>{t("table.exercise_duration")}:</span>
          <input
            type="number"
            value={duration === null ? "" : duration}
            onChange={e => {
              const val = e.target.value;
              setDuration(val === "" ? null : Number(val));
            }}
          />
        </div>

        <button onClick={handleSave} className="field" style={{ marginTop: "1rem" }}>{t("buttons.save")}</button>
      </Modal>
    </>
  );
};

export default OptionsEdit;
