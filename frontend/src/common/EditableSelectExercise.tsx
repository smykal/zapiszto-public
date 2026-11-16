import React, { useState, useEffect } from 'react';
import { DictExercises } from '../types/types';
import { useTranslation } from 'react-i18next';

interface EditableSelectExerciseProps {
    value: string;
    options: DictExercises[];
    onSave: (newExerciseId: string) => void;
}

const EditableSelectExercise: React.FC<EditableSelectExerciseProps> = ({ value, options, onSave }) => {
    const { t } = useTranslation('global');
    const [editing, setEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedExercise, setSelectedExercise] = useState(value);

    useEffect(() => {
        setSelectedExercise(value);
    }, [value]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setSelectedExercise(''); // Reset exercise selection when category changes
    };

    const handleExerciseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedExercise(e.target.value);
    };

    const handleSave = () => {
        const selectedExerciseData = options.find(
            (option) => option.name === selectedExercise && option.category_name === selectedCategory
        );
        if (selectedExerciseData) {
            onSave(selectedExerciseData.id);
        }
        setEditing(false);
    };

    const handleDoubleClick = () => {
        setEditing(true);
    };

    // Get unique category names for the first select
    const categoryOptions = Array.from(new Set(options.map((option) => option.category_name)));

    // Filter exercises by selected category for the second select
    const exerciseOptions = selectedCategory
        ? options.filter((option) => option.category_name === selectedCategory)
        : [];

    return (
        <span onDoubleClick={handleDoubleClick}>
            {editing ? (
                <div>
                    <select value={selectedCategory || ''} onChange={handleCategoryChange}>
                        <option value="">{t("session.select_category")}</option>
                        {categoryOptions.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    <select value={selectedExercise} onChange={handleExerciseChange} onBlur={handleSave}>
                        <option value="">{t("session.select_exercise")}</option>
                        {exerciseOptions.map((exercise) => (
                            <option key={exercise.id} value={exercise.name}>
                                {exercise.name}
                            </option>
                        ))}
                    </select>
                </div>
            ) : (
                selectedExercise || value
            )}
        </span>
    );
};

export default EditableSelectExercise;
