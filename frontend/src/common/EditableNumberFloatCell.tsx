import React, { useState, useEffect } from 'react';

interface EditableNumberFloatCellProps {
  value: number;
  onSave: (newValue: number) => void;
}

const EditableNumberFloatCell: React.FC<EditableNumberFloatCellProps> = ({ value, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState<number | string>(value);
  const [error, setError] = useState<string | null>(null); // Zmienna na przechowanie błędu

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCurrentValue(newValue);
  };

  const validateAndSave = (numericValue: number) => {
    if (numericValue > 0) {
      onSave(numericValue);
      setError(null); // Resetowanie błędu
    } else {
      setError('Value must be positive');
    }
  };

  const handleBlur = () => {
    setEditing(false);
    const numericValue = parseFloat(currentValue.toString());
    if (!isNaN(numericValue)) {
      validateAndSave(numericValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditing(false);
      const numericValue = parseFloat(currentValue.toString());
      if (!isNaN(numericValue)) {
        validateAndSave(numericValue);
      }
    } else if (e.key === 'Escape') {
      setCurrentValue(value);
      setEditing(false);
    }
  };

  return (
    <span onDoubleClick={handleDoubleClick}>
      {editing ? (
        <div>
          <input
            type="number"
            step="any"
            value={currentValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            min={0} // Minimalna wartość ustawiona na 0
            autoFocus
          />
          {error && <span style={{ color: 'red' }}>{error}</span>} {/* Pokazanie błędu */}
        </div>
      ) : (
        value
      )}
    </span>
  );
};

export default EditableNumberFloatCell;
