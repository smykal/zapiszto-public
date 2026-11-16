import React, { useEffect, useState } from 'react';
import Modal from '../../../constants/Modal';
import { LANGUAGES } from '../../../translations/Languages';
import { useGetDictUnitDetails, useUpdateDictUnitTranslations } from '../../../services/dict/DictUnitsTanstackService';
import EditableCell from '../../../common/EditableCell';
import { useTranslation } from 'react-i18next';

interface LanguageModalProps {
    show: boolean;
    onClose: () => void;
    unitId: string;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ show, onClose, unitId }) => {
    const [unitData, setUnitData] = useState<any | null>(null);
    const { t } = useTranslation("global");
    const { data: fetchedUnitData } = useGetDictUnitDetails(unitId);
    const updateDictUnitTranslationsMutation = useUpdateDictUnitTranslations();

    useEffect(() => {
        if (fetchedUnitData) {
            setUnitData(fetchedUnitData);
        }
    }, [fetchedUnitData]);

    const handleSave = (languageCode: string, newName: string, newShortcut: string) => {
        if (unitData) {
            const updatedData = {
                ...unitData,
                name: {
                    ...unitData.name,
                    [languageCode]: newName,
                },
                shortcut: {
                    ...unitData.shortcut,
                    [languageCode]: newShortcut,
                }
            };
            setUnitData(updatedData);
        }
    };

    const handleModalClose = () => {
        if (unitData) {
            updateDictUnitTranslationsMutation.mutate(unitData, {
                onError: (error) => {
                    console.error('Error updating unit:', error);
                }
            });
        }
        onClose();
    };

    return (
        <Modal show={show} onClose={handleModalClose} title="Unit Details">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>{t("table.language")}</th>
                        <th>{t("table.name")}</th>
                        <th>{t("table.shortcut")}</th>
                    </tr>
                </thead>
                <tbody>
                    {LANGUAGES.map((language) => (
                        <tr key={language.code}>
                            <td>{language.label}</td>
                            <td>
                                <EditableCell
                                    value={unitData?.name[language.code] || t('table.no_translation')}
                                    onSave={(newValue) => handleSave(language.code, newValue, unitData?.shortcut[language.code] || '')}
                                />
                            </td>
                            <td>
                                <EditableCell
                                    value={unitData?.shortcut[language.code] || t('table.no_translation')}
                                    onSave={(newValue) => handleSave(language.code, unitData?.name[language.code] || '', newValue)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p>{t("dictionaries.edit_language_values")}</p>
        </Modal>
    );
};

export default LanguageModal;
