import React, { useState, useEffect } from 'react';

interface EditableSelectEquipmentProps {
  value: string | null;
  options: string[];
  onSave: (newValue: string | null) => void;
}

const EditableSelectEquipment: React.FC<EditableSelectEquipmentProps> = ({ value, options, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState<string | null>(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setCurrentValue(selectedValue === '' ? null : selectedValue);
  };

  const handleBlur = () => {
    setEditing(false);
    onSave(currentValue);
  };

  return (
    <span onDoubleClick={handleDoubleClick}>
      {editing ? (
        <select
          value={currentValue ?? ''}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        >
          <option value="">--</option> {/* Dodajemy pustą opcję na początku */}
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        currentValue || '--'
      )}
    </span>
  );
};

export default EditableSelectEquipment;
