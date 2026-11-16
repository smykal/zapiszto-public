import React, { useState, useEffect } from "react";
import AuthService from '../../../services/auth.service';
import IUser from '../../../types/user.type';
import { DictQuantityType } from "../../../types/types";
import DictQuantityTypeService from '../../../services/dict/DictQuantityTypeService';
import AddDictQuantityTypePerUser from "./AddDictQuantityType";
import Options from "./Options";
import LanguageModal from "./LanguageMondal";
import { useTranslation } from "react-i18next";
import Modal from "../../../constants/Modal";

const ShowDictQuantityType: React.FC = () => {
    const [dictQuantityTypes, setDictQuantityTypes] = useState<DictQuantityType[]>([]);
    const [showBasic, setShowBasic] = useState(true);
    const [showPerUser, setShowPerUser] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddItemVisible, setModalAddItemVisible] = useState(false);
    const [selectedQuantityTypeId, setSelectedQuantityTypeId] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const { t } = useTranslation("global");

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
        loadDictQuantityTypes();
    }, []);

    const hasRole = (role: string): boolean => {
        return currentUser?.roles?.includes(role) ?? false;
    };

    const loadDictQuantityTypes = () => {
        DictQuantityTypeService.getDictQuantityTypes()
            .then(response => {
                setDictQuantityTypes(response.data);
            })
            .catch(error => {
                console.error('Error loading dict quantity types:', error);
            });
    };

    const handleAddQuantityType = (newQuantityType: DictQuantityType) => {
        setDictQuantityTypes(prevQuantityTypes => [...prevQuantityTypes, newQuantityType]);
        setModalAddItemVisible(false); // Zamknięcie modala po dodaniu nowego elementu
    };

    const handleDeleteQuantityType = (quantityTypeId: string) => {
        setDictQuantityTypes(prevQuantityTypes => prevQuantityTypes.filter(quantityType => quantityType.dict_id !== quantityTypeId));
    };

    const handleShowBasicChange = () => {
        setShowBasic(!showBasic);
    };

    const handleShowPerUserChange = () => {
        setShowPerUser(!showPerUser);
    };

    const handleNameDoubleClick = (id: string, dict: string) => {
        setSelectedQuantityTypeId(id);
        setModalVisible(true);
    };

    const filteredQuantityTypes = dictQuantityTypes.filter(quantityType => {
        if (showBasic && quantityType.dict === "BASIC") return true;
        if (showPerUser && quantityType.dict === "PER_USER") return true;
        return false;
    });

    return (
        <div><div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em', marginBottom: '1em' }}>
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
                {t("buttons.add")}
            </button>

            <table style={{ borderCollapse: 'collapse' }} className="fixed-table">
                <thead>
                    <tr>
                        <th>{t("table.name")}</th>
                        <th>{t("table.shortcut")}</th>
                        <th>{t("table.options")}</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredQuantityTypes.map((row) => (
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
                            }}>{row.name}</td>
                            <td style={{
                                cursor: (row.dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
                                    (row.dict === "BASIC" && hasRole("ROLE_ADMIN"))
                                    ? 'pointer'
                                    : 'default',
                                color: (row.dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
                                    (row.dict === "BASIC" && hasRole("ROLE_ADMIN"))
                                    ? 'inherit'
                                    : 'var(--color03)',
                            }}>{row.shortcut}</td>
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
                                {row.dict === "PER_USER" ? (
                                    <Options item={row.dict_id} dict={row.dict} onDeleteQuantityType={handleDeleteQuantityType} onEditQuantityType={handleNameDoubleClick} />
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
            <Modal show={modalAddItemVisible} onClose={() => setModalAddItemVisible(false)} title={t("buttons.add_dict_quantity_type")}>
                <AddDictQuantityTypePerUser dictQuantityTypes={dictQuantityTypes} onAddQuantityType={handleAddQuantityType} />
            </Modal>
            <LanguageModal
                show={modalVisible}
                onClose={() => setModalVisible(false)}
                quantityTypeId={selectedQuantityTypeId!}
            />
        </div>
    );
};

export default ShowDictQuantityType;
