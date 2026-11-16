import React, { useEffect, useState } from "react";
import { DictCategories } from "../../../types/types";
import Service from '../../../services/dict/DictCategoryService';
import AddDictCategoryPerUser from "./AddDictCategory";
import Options from './Options';
import LanguageModal from "./LanguageModal";
import { useTranslation } from "react-i18next";
import AuthService from '../../../services/auth.service';
import IUser from '../../../types/user.type';
import Modal from "../../../constants/Modal";

const ShowDictCategory: React.FC = () => {
    const [dictCategories, setDictCategories] = useState<DictCategories[]>([]);
    const [showBasic, setShowBasic] = useState(true);
    const [showPerUser, setShowPerUser] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddItemVisible, setModalAddItemVisible] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const { t } = useTranslation("global");
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        loadDictCategories();
    }, []);

    const loadDictCategories = () => {
        Service.getDictCategory()
            .then(response => {
                setDictCategories(response.data);
            })
            .catch(error => {
                console.error('Error loading dict categories:', error);
            });
    };

    const handleAddCategory = (newCategory: DictCategories) => {
        setDictCategories(prevCategories => [...prevCategories, newCategory]);
        setModalAddItemVisible(false); // Zamknięcie modala po dodaniu nowego elementu
    };

    const handleDeleteCategory = (id: string) => {
        setDictCategories(prevCategories => prevCategories.filter(category => category.dict_id !== id));
    };

    const handleShowBasicChange = () => {
        setShowBasic(!showBasic);
    };

    const handleShowPerUserChange = () => {
        setShowPerUser(!showPerUser);
    };

    const handleNameDescriptionDoubleClick = (id: string, dict: string) => {
        if (
            (dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
            (dict === "BASIC" && hasRole("ROLE_ADMIN"))
        ) {
            setSelectedCategoryId(id);
            setModalVisible(true);
        }
    };

    const hasRole = (role: string): boolean => {
        return currentUser?.roles?.includes(role) ?? false;
    };

    const filteredCategories = dictCategories
        .filter(category => {
            if (showBasic && category.dict === "BASIC") return true;
            if (showPerUser && category.dict === "PER_USER") return true;
            return false;
        })
        .sort((a, b) => {
            // najpierw BASIC, potem PER_USER
            if (a.dict === "BASIC" && b.dict !== "BASIC") return -1;
            if (a.dict !== "BASIC" && b.dict === "BASIC") return 1;
            // w obrębie tej samej grupy sortuj po nazwie
            return a.name.localeCompare(b.name, "pl", { sensitivity: "base" });
        });

    return (
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
            <button onClick={() => setModalAddItemVisible(true)} className="field">
                {t("buttons.add_category")}
            </button>

            <table style={{ borderCollapse: 'collapse' }} className="fixed-table">
                <thead>
                    <tr>
                        <th>{t("table.name")}</th>
                        <th>{t("table.description")}</th>
                        <th>{t("table.options")}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCategories.map((row) => (
                        <tr key={row.id}>
                            <td
                                onDoubleClick={() => handleNameDescriptionDoubleClick(row.dict_id, row.dict)}
                                style={{
                                    cursor: (row.dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
                                        (row.dict === "BASIC" && hasRole("ROLE_ADMIN"))
                                        ? 'pointer'
                                        : 'default',
                                    color: (row.dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
                                        (row.dict === "BASIC" && hasRole("ROLE_ADMIN"))
                                        ? 'inherit'
                                        : 'var(--color03)',
                                }}
                            >
                                {row.name}
                            </td>
                            <td
                                onDoubleClick={() => handleNameDescriptionDoubleClick(row.dict_id, row.dict)}
                                style={{
                                    cursor: (row.dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
                                        (row.dict === "BASIC" && hasRole("ROLE_ADMIN"))
                                        ? 'pointer'
                                        : 'default',
                                    color: (row.dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
                                        (row.dict === "BASIC" && hasRole("ROLE_ADMIN"))
                                        ? 'inherit'
                                        : 'var(--color03)',
                                }}
                            >
                                {row.description}
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
                            }}>
                                {(hasRole("ROLE_ADMIN") && row.dict === "BASIC") ? (
                                    <Options item={row.dict_id} onDeleteCategory={handleDeleteCategory} />
                                ) : (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER")) && row.dict === "PER_USER" ? (
                                    <Options item={row.dict_id} onDeleteCategory={handleDeleteCategory} />
                                ) : (
                                    <>
                                        <img
                                            src="/images/navigation/options.svg"
                                            alt="Options"
                                            className="options-icon disabled"
                                        />
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal show={modalAddItemVisible} onClose={() => setModalAddItemVisible(false)} title={t("buttons.add_category")}>
                <AddDictCategoryPerUser dictCategory={dictCategories} onAddCategory={handleAddCategory} />
            </Modal>
            <LanguageModal
                show={modalVisible}
                onClose={() => setModalVisible(false)}
                categoryId={selectedCategoryId!}
            />
        </div>
    );
};

export default ShowDictCategory;
