import React, { useState } from "react";
import { ExerciseSession, DictCategories, DictExercises, DictSessionPartDto, DictQuantityType, DictUnits, DictEquipment } from "../../../../../types/types";
import { useTranslation } from "react-i18next";

interface Props {
  show: boolean;
  onClose: () => void;
  onAdd: (exercise: ExerciseSession) => void;
  sessionId: string;
  sessionPartOptions: DictSessionPartDto[];
  quantityTypeOptions: DictQuantityType[];
  exercisesOptions: DictExercises[];
  unitsOptions: DictUnits[];
  equipmentOptions: DictEquipment[];
  categories: DictCategories[];
}

const AddExerciseSession: React.FC<Props> = ({ show, onClose, onAdd, sessionId, sessionPartOptions, quantityTypeOptions, exercisesOptions, unitsOptions, equipmentOptions, categories }) => {
  const { t } = useTranslation("global");
  // Pola formularza
  const [dictExerciseId, setDictExerciseId] = useState("");
  const [dictCategoryId, setDictCategoryId] = useState("");
  const [dictSessionPartId, setDictSessionPartId] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [dictQuantityTypeName, setDictQuantityTypeName] = useState("");
  const [dictQuantityTypeId, setDictQuantityTypeId] = useState("");
  const [volume, setVolume] = useState<number | null>(null);
  const [dictUnitName, setDictUnitName] = useState("");
  const [dictUnitNameId, setDictUnitNameId] = useState(""); // Added state for dictUnitNameId
  const [notes, setNotes] = useState("");
  const [restTime, setRestTime] = useState<number | null>(null);
  const [tempo, setTempo] = useState("");
  const [sets, setSets] = useState<number>(1);
  const [equipmentName, setEquipmentName] = useState("");
  const [dictEquipmentId, setDictEquipmentId] = useState("");
  const [equipmentAttribute, setEquipmentAttribute] = useState("");
  const [weightPerSide, setWeightPerSide] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  // Wyciągnij nazwę ćwiczenia i kategorii na podstawie id
  const dictExerciseName = exercisesOptions.find(e => e.id === dictExerciseId)?.name || "";
  const dictCategoryName = categories.find(c => c.id === dictCategoryId)?.name || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExercise: ExerciseSession = {
      exerciseId: "", // Backend wygeneruje
      sessionId,
      dictExerciseName,
      dictExerciseId,
      dictCategoryName,
      dictCategoryId,
      quantity,
      dictQuantityTypeName,
      dictQuantityTypeId,
      volume,
      dictUnitName,
      dictUnitNameId,
      notes,
      orderNumber: 0, // Backend ustawi
      restTime,
      tempo,
      dictSessionPartName: sessionPartOptions.find(s => s.id === dictSessionPartId)?.name || "",
      dictSessionPartId,
      sets,
      equipmentName,
      dictEquipmentId: dictEquipmentId || null,
      equipmentAttribute,
      weightPerSide,
      duration,
      executed: false, // Domyślnie false
      hasAttachment: false, // Domyślnie false
    };
    onAdd(newExercise);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: ".5em", gridTemplateColumns: ".6fr 2fr", alignItems: "center" }}>
        <span style={{ textAlign: "right" }}>{t("table.session_part")}:</span>
        <select value={dictSessionPartId} onChange={e => setDictSessionPartId(e.target.value)}>
          <option value="">--</option>
          {sessionPartOptions.map((part) => (
            <option key={part.id} value={part.id}>{part.name}</option>
          ))}
        </select>
        <span style={{ textAlign: "right" }}>{t("table.category")}</span>
        <select value={dictCategoryId} onChange={e => setDictCategoryId(e.target.value)}>
          <option value="">--</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <span style={{ textAlign: "right" }}>{t("table.exercise")}</span>
        <select value={dictExerciseId} onChange={e => setDictExerciseId(e.target.value)}>
          <option value="">--</option>
          {exercisesOptions.filter(e => !dictCategoryId || e.category_id === dictCategoryId).map(ex => (
            <option key={ex.id} value={ex.id}>{ex.name}</option>
          ))}
        </select>
        <span style={{ textAlign: "right" }}>{t("table.quantity")}</span>
        <input type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
        <span style={{ textAlign: "right" }}>{t("table.quantity_type")}</span>
        <select
          value={dictQuantityTypeId}
          onChange={e => {
            const selected = quantityTypeOptions.find(q => q.id === e.target.value);
            setDictQuantityTypeId(e.target.value);
            setDictQuantityTypeName(selected ? selected.name : "");
          }}
        >
          <option value="">--</option>
          {quantityTypeOptions.map(q => (
            <option key={q.id} value={q.id}>{q.name}</option>
          ))}
        </select>
        <span style={{ textAlign: "right" }}>{t("table.unit")}</span>
        <select
          value={dictUnitNameId}
          onChange={e => {
            const selected = unitsOptions.find(u => u.id === e.target.value);
            setDictUnitNameId(e.target.value);
            setDictUnitName(selected ? selected.name : "");
          }}
        >
          <option value="">--</option>
          {unitsOptions.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <span style={{ textAlign: "right" }}>{t("table.volume")}</span>
        <input type="number" value={volume === null ? "" : volume} onChange={e => setVolume(e.target.value === "" ? null : Number(e.target.value))} />
        <span style={{ textAlign: "right" }}>{t("table.rest_time")}</span>
        <input type="number" value={restTime === null ? "" : restTime} onChange={e => setRestTime(e.target.value === "" ? null : Number(e.target.value))} />
        <span style={{ textAlign: "right" }}>{t("table.tempo")}</span>
        <input value={tempo} onChange={e => setTempo(e.target.value)} />
        <span style={{ textAlign: "right" }}>{t("table.sets")}</span>
        <input type="number" value={sets} onChange={e => setSets(Number(e.target.value))} />
        <span style={{ textAlign: "right" }}>{t("table.equipment")}</span>
        <select
          value={dictEquipmentId}
          onChange={e => {
            const selected = equipmentOptions.find(eq => eq.id === e.target.value);
            setDictEquipmentId(e.target.value);
            setEquipmentName(selected ? selected.name : "");
          }}
        >
          <option value="">--</option>
          {equipmentOptions.map(eq => (
            <option key={eq.id} value={eq.id}>{eq.name}</option>
          ))}
        </select>
        <span style={{ textAlign: "right" }}>{t("table.equipment_attribute")}</span>
        <input value={equipmentAttribute} onChange={e => setEquipmentAttribute(e.target.value)} />
        <span style={{ textAlign: "right" }}>{t("table.weight_per_side")}</span>
        <input type="number" value={weightPerSide === null ? "" : weightPerSide} onChange={e => setWeightPerSide(e.target.value === "" ? null : Number(e.target.value))} />
        <span style={{ textAlign: "right" }}>{t("table.exercise_duration")}</span>
        <input type="number" value={duration === null ? "" : duration} onChange={e => setDuration(e.target.value === "" ? null : Number(e.target.value))} />
        <span style={{ textAlign: "right" }}>{t("table.notes")}</span>
        <input value={notes} onChange={e => setNotes(e.target.value)} />
        <div></div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button type="submit">{t("buttons.save")}</button>
          <button type="button" onClick={onClose}>{t("buttons.cancel")}</button>
        </div>
      </form>
    </div>
  );
};

export default AddExerciseSession;
