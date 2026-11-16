import React, { useState } from "react";

interface EditableExecutedAllCellProps {
  sessionId: string;
  onUpdateAll: (sessionId: string) => Promise<any>;
  onSaveAll: () => void;
}

const EditableExecutedAllCell: React.FC<EditableExecutedAllCellProps> = ({
  sessionId,
  onUpdateAll,
  onSaveAll,
}) => {
  const [loading, setLoading] = useState(false);
  const [executedAll, setExecutedAll] = useState(false);

  const handleToggleAll = async () => {
    const newValue = !executedAll;
    setExecutedAll(newValue);
    setLoading(true);

    try {
      await onUpdateAll(sessionId);
      onSaveAll();
    } catch (error) {
      console.error("Error updating all executed:", error);
      setExecutedAll(!newValue); // rollback
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleAll}
      disabled={loading}
      style={{
        cursor: loading ? "not-allowed" : "pointer",
        padding: "6px 12px",
        fontSize: "14px",
        borderRadius: "6px",
        backgroundColor: executedAll ? "#4caf50" : "#e0e0e0",
        color: executedAll ? "white" : "black",
        border: "none",
        transition: "background-color 0.2s",
      }}
    >
      {loading
        ? "..."
        : executedAll
        ? "✅ Wszystkie wykonane"
        : "Oznacz wszystkie jako wykonane"}
    </button>
  );
};

export default EditableExecutedAllCell;
