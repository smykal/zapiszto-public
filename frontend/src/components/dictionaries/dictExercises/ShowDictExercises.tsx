import React, { useState, useEffect } from "react";
import { DictCategories, DictExercises } from "../../../types/types";
import { useTranslation } from "react-i18next";
import Options from "./Options";
import AddDictExercisePerUser from "./AddDictExercise";
import DictExercisesService from "../../../services/dict/DictExercisesService";
import CategoryService from '../../../services/dict/DictCategoryService';
import LanguageModal from "./LanguageModal";
import AuthService from '../../../services/auth.service';
import IUser from '../../../types/user.type';
import Modal from "../../../constants/Modal";
import ExercisesAttachmentsShow from "../../exercisesAttachments/ExercisesAttachmentsShow";

const ShowDictExercises: React.FC = () => {
    const [dictExercises, setDictExercises] = useState<DictExercises[]>([]);
    const [dictCategories, setDictCategories] = useState<DictCategories[]>([]);
    const [showBasic, setShowBasic] = useState(true);
    const [showPerUser, setShowPerUser] = useState(true);
    const [modalAddItemVisible, setModalAddItemVisible] = useState(false);
    const [modalLanguageVisible, setModalLanguageVisible] = useState(false);
    const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { t } = useTranslation("global");
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        loadDictExercises();
        loadDictCategories();
    }, []);

    const loadDictExercises = () => {
        DictExercisesService.getDictExercises()
            .then(response => {
                setDictExercises(response.data);
            })
            .catch(error => {
                console.error('Error loading dict exercises:', error);
            });
    };

    const loadDictCategories = () => {
        CategoryService.getDictCategory()
            .then(response => {
                setDictCategories(response.data);
            })
            .catch(error => {
                console.error('Error loading dict categories:', error);
            });
    };

    const hasRole = (role: string): boolean => {
        return currentUser?.roles?.includes(role) ?? false;
    };

    const handleAddExercise = () => {
        loadDictExercises(); // Odśwież listę ćwiczeń z backendu, aby mieć prawdziwe id
        setModalAddItemVisible(false);
    };

    const handleDeleteExercise = (id: string) => {
        setDictExercises(prevExercises => prevExercises.filter(exercise => exercise.dict_id !== id));
    };

    const handleEditExercise = (id: string, dict: string) => {
        setSelectedExerciseId(id);
        setModalLanguageVisible(true);
    };

    const handleShowBasicChange = () => {
        setShowBasic(!showBasic);
    };

    const handleShowPerUserChange = () => {
        setShowPerUser(!showPerUser);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const filteredExercises = dictExercises.filter(exercise => {
        const matchesCategory = selectedCategory ? exercise.category_id === selectedCategory : true;
        if (showBasic && exercise.dict === "BASIC" && matchesCategory) return true;
        if (showPerUser && exercise.dict === "PER_USER" && matchesCategory) return true;
        return false;
    });

    return (
        <div>
            <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em', marginBottom: '1em' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={showBasic}
                            onChange={handleShowBasicChange}
                        />
                        {t('dictionaries.basic')}
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showPerUser}
                            onChange={handleShowPerUserChange}
                        />
                        {t('dictionaries.per_user')}
                    </label>
                </div>
                <div>
                    <select
                        value={selectedCategory ?? ''}
                        onChange={handleCategoryChange}
                        className="field"
                    >
                        <option value="">{t('dictionaries.filter_categories')}</option>
                        {dictCategories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <button onClick={() => setModalAddItemVisible(true)} className="field">
                {t("buttons.add_exercise")}
            </button>

            <table style={{ borderCollapse: 'collapse' }} className="fixed-table">
                <thead>
                    <tr>
                        <th>{t("table.name")}</th>
                        <th>{t("table.category")}</th>
                        <th>{t("table.options")}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExercises.map((row) => (
                        <tr key={row.id}>
                            <td style={{
                                cursor: (row.dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
                                    (row.dict === "BASIC" && hasRole("ROLE_ADMIN"))
                                    ? 'pointer'
                                    : 'default',
                                color: (row.dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
                                    (row.dict === "BASIC" && hasRole("ROLE_ADMIN"))
                                    ? 'inherit'
                                    : 'var(--color03)',
                            }}>{row.name}
                                {row.hasAttachments && <ExercisesAttachmentsShow dictExerciseId={row.id} />}
                            </td>
                            <td style={{
                                cursor: (row.dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
                                    (row.dict === "BASIC" && hasRole("ROLE_ADMIN"))
                                    ? 'pointer'
                                    : 'default',
                                color: (row.dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
                                    (row.dict === "BASIC" && hasRole("ROLE_ADMIN"))
                                    ? 'inherit'
                                    : 'var(--color03)',
                            }}>{row.category_name}</td>
                            <td style={{
                                cursor: (row.dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
                                    (row.dict === "BASIC" && hasRole("ROLE_ADMIN"))
                                    ? 'pointer'
                                    : 'default',
                                color: (row.dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
                                    (row.dict === "BASIC" && hasRole("ROLE_ADMIN"))
                                    ? 'inherit'
                                    : 'var(--color03)',
                            }}>
                                {(hasRole("ROLE_ADMIN") && row.dict === "BASIC") ? (
                                    <Options dictExercise={row} onDeleteExercise={handleDeleteExercise} onEditExercise={handleEditExercise} />
                                ) : (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER")) && row.dict === "PER_USER" ? (
                                    <Options dictExercise={row} onDeleteExercise={handleDeleteExercise} onEditExercise={handleEditExercise} />
                                ) : (
                                    <img
                                        src="/images/navigation/options.svg"
                                        alt="Options"
                                        className="options-icon disabled"
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal show={modalAddItemVisible} onClose={() => setModalAddItemVisible(false)} title={t("buttons.add_exercise")}>
                <AddDictExercisePerUser dictExercises={dictExercises} dictCategories={dictCategories} onAddExercise={handleAddExercise} />
            </Modal>
            <LanguageModal
                show={modalLanguageVisible}
                onClose={() => setModalLanguageVisible(false)}
                exerciseId={selectedExerciseId!}
            />
        </div>
    );
};

export default ShowDictExercises;
