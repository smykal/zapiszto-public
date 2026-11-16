import React, { useEffect, useState } from 'react';
import Modal from '../../../constants/Modal';
import { LANGUAGES } from '../../../translations/Languages';
import DictEquipmentService from '../../../services/dict/DictEquipmentService';
import EditableCell from '../../../common/EditableCell';
import { useTranslation } from 'react-i18next';

interface LanguageModalProps {
    show: boolean;
    onClose: () => void;
    equipmentId: string;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ show, onClose, equipmentId }) => {
    const [equipmentData, setEquipmentData] = useState<any | null>(null);
    const { t } = useTranslation("global");

    useEffect(() => {
        if (equipmentId) {
            DictEquipmentService.getDictEquipmentDetails(equipmentId)
                .then(response => {
                    setEquipmentData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching equipment details:', error);
                });
        }
    }, [equipmentId]);

    const handleSave = (languageCode: string, newName: string) => {
        if (equipmentData) {
            const updatedData = {
                ...equipmentData,
                name: {
                    ...equipmentData.name,
                    [languageCode]: newName,
                }
            };
            setEquipmentData(updatedData);
        }
    };

    const handleModalClose = () => {
        if (equipmentData) {
            DictEquipmentService.updateDictEquipmentTranslations(equipmentData)
                .then(() => {
                    console.log('Equipment updated successfully');
                })
                .catch(error => {
                    console.error('Error updating equipment:', error);
                });
        }
        onClose();
    };

    return (
        <Modal show={show} onClose={handleModalClose} title="Equipment Details">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>{t("table.language")}</th>
                        <th>{t("table.name")}</th>
                    </tr>
                </thead>
                <tbody>
                    {LANGUAGES.map((language) => (
                        <tr key={language.code}>
                            <td>{language.label}</td>
                            <td>
                                <EditableCell
                                    value={equipmentData?.name[language.code] || t('table.no_translation')}
                                    onSave={(newValue) => handleSave(language.code, newValue)}
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
