import React, { useState, useEffect } from "react";
import { DictUnits } from "../../../types/types";
import { useGetDictUnits } from '../../../services/dict/DictUnitsTanstackService';
import AddDictUnitPerUser from "./AddDictUnit";
import Options from "./Options";
import LanguageModal from "./LanguageModal";
import { useTranslation } from "react-i18next";
import AuthService from '../../../services/auth.service';
import IUser from '../../../types/user.type';
import Modal from "../../../constants/Modal";

const ShowDictUnits: React.FC = () => {
    const [dictUnits, setDictUnits] = useState<DictUnits[]>([]);
    const [showBasic, setShowBasic] = useState(true);
    const [showPerUser, setShowPerUser] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddItemVisible, setModalAddItemVisible] = useState(false);
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
    const { t } = useTranslation("global");
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const { data: fetchedDictUnits } = useGetDictUnits();

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    useEffect(() => {
        if (fetchedDictUnits) {
            setDictUnits(fetchedDictUnits);
        }
    }, [fetchedDictUnits]);

    const handleAddUnit = (newUnit: DictUnits) => {
        setDictUnits(prevUnits => [...prevUnits, newUnit]);
        setModalAddItemVisible(false); // Zamknięcie modala po dodaniu nowego elementu
    };

    const handleDeleteUnit = (unitId: string) => {
        setDictUnits(prevUnits => prevUnits.filter(unit => unit.dict_id !== unitId));
    };

    const handleShowBasicChange = () => {
        setShowBasic(!showBasic);
    };

    const handleShowPerUserChange = () => {
        setShowPerUser(!showPerUser);
    };

    const handleNameDoubleClick = (id: string, dict: string) => {
        setSelectedUnitId(id);
        setModalVisible(true);
    };

    const hasRole = (role: string): boolean => {
        return currentUser?.roles?.includes(role) ?? false;
    };

    const filteredUnits = dictUnits.filter(unit => {
        if (showBasic && unit.dict === "BASIC") return true;
        if (showPerUser && unit.dict === "PER_USER") return true;
        return false;
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
                    {filteredUnits.map((row) => (
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
                                {(hasRole("ROLE_ADMIN") && row.dict === "BASIC") ? (
                                    <Options item={row.dict_id} dict={row.dict} onDeleteUnit={handleDeleteUnit} onEditUnit={handleNameDoubleClick} />
                                ) : (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER")) && row.dict === "PER_USER" ? (
                                    <Options item={row.dict_id} dict={row.dict} onDeleteUnit={handleDeleteUnit} onEditUnit={handleNameDoubleClick} />
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

            <Modal show={modalAddItemVisible} onClose={() => setModalAddItemVisible(false)} title={t("buttons.add_unit")}>
                <AddDictUnitPerUser dictUnits={dictUnits} onAddUnit={handleAddUnit} />
            </Modal>
            <LanguageModal
                show={modalVisible}
                onClose={() => setModalVisible(false)}
                unitId={selectedUnitId!}
            />
        </div>
    );
};

export default ShowDictUnits;
