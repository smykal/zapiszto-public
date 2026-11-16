import React, { useState, useEffect } from "react";

interface EditableExecutedCellProps {
  exerciseId: string;
  value: boolean | null;
  onSave: (newValue: boolean) => void;
  onUpdate: (exerciseId: string) => Promise<any>;
}

const EditableExecutedCell: React.FC<EditableExecutedCellProps> = ({
  exerciseId,
  value,
  onSave,
  onUpdate,
}) => {
  const [executed, setExecuted] = useState<boolean>(value ?? false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setExecuted(value ?? false);
  }, [value]);

  const handleToggle = async () => {
    const newValue = !executed;
    setExecuted(newValue);
    setLoading(true);

    try {
      await onUpdate(exerciseId);
      onSave(newValue);
    } catch (error) {
      console.error("Error updating executed:", error);
      setExecuted(executed); // rollback
    } finally {
      setLoading(false);
    }
  };

  return (
    <span style={{ display: "flex", justifyContent: "center" }}>
      <input
        type="checkbox"
        checked={executed}
        disabled={loading}
        onChange={handleToggle}
        style={{ cursor: "pointer", width: "18px", height: "18px" }}
      />
    </span>
  );
};

export default EditableExecutedCell;
