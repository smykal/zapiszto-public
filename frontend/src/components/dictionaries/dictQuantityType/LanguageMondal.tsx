import React, { useEffect, useState } from 'react';
import Modal from '../../../constants/Modal';
import { LANGUAGES } from '../../../translations/Languages';
import DictQuantityTypeService from '../../../services/dict/DictQuantityTypeService';
import EditableCell from '../../../common/EditableCell';
import { useTranslation } from 'react-i18next';

interface LanguageModalProps {
    show: boolean;
    onClose: () => void;
    quantityTypeId: string;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ show, onClose, quantityTypeId }) => {
    const [quantityTypeData, setQuantityTypeData] = useState<any | null>(null);
    const { t } = useTranslation("global");

    useEffect(() => {
        if (quantityTypeId) {
            DictQuantityTypeService.getDictQuantityTypeDetails(quantityTypeId)
                .then(response => {
                    setQuantityTypeData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching quantity type details:', error);
                });
        }
    }, [quantityTypeId]);

    const handleSave = (languageCode: string, newName: string, newShortcut: string) => {
        if (quantityTypeData) {
            const updatedData = {
                ...quantityTypeData,
                name: {
                    ...quantityTypeData.name,
                    [languageCode]: newName,
                },
                shortcut: {
                    ...quantityTypeData.shortcut,
                    [languageCode]: newShortcut,
                }
            };
            setQuantityTypeData(updatedData);
        }
    };

    const handleModalClose = () => {
        if (quantityTypeData) {
            DictQuantityTypeService.updateDictQuantityTypeTranslations(quantityTypeData)
                .then(() => {
                    console.log('Quantity type updated successfully');
                })
                .catch(error => {
                    console.error('Error updating quantity type:', error);
                });
        }
        onClose();
    };

    return (
        <Modal show={show} onClose={handleModalClose} title="Quantity Type Details">
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
                                    value={quantityTypeData?.name[language.code] || t('table.no_translation')}
                                    onSave={(newValue) => handleSave(language.code, newValue, quantityTypeData?.shortcut[language.code] || '')}
                                />
                            </td>
                            <td>
                                <EditableCell
                                    value={quantityTypeData?.shortcut[language.code] || t('table.no_translation')}
                                    onSave={(newValue) => handleSave(language.code, quantityTypeData?.name[language.code] || '', newValue)}
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
