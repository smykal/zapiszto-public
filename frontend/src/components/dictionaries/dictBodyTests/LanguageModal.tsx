import React, { useEffect, useState } from 'react';
import Modal from '../../../constants/Modal';
import { LANGUAGES } from '../../../translations/Languages';
import DictBodyTestService from '../../../services/dict/DictBodyTestService';
import EditableCell from '../../../common/EditableCell';
import { useTranslation } from 'react-i18next';

interface LanguageModalProps {
    show: boolean;
    onClose: () => void;
    bodyTestId: string;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ show, onClose, bodyTestId }) => {
    const [bodyTestData, setBodyTestData] = useState<any | null>(null);
    const { t } = useTranslation("global");

    useEffect(() => {
        if (bodyTestId) {
            DictBodyTestService.getDictBodyTestDetails(bodyTestId)
                .then(response => {
                    setBodyTestData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching body test details:', error);
                });
        }
    }, [bodyTestId]);

    const handleSave = (languageCode: string, newName: string, newDescription: string, newPurpose: string) => {
        if (bodyTestData) {
            const updatedData = {
                ...bodyTestData,
                name: {
                    ...bodyTestData.name,
                    [languageCode]: newName,
                },
                description: {
                    ...bodyTestData.description,
                    [languageCode]: newDescription,
                },
                purpose: {
                    ...bodyTestData.purpose,
                    [languageCode]: newPurpose,
                }
            };
            setBodyTestData(updatedData);
        }
    };

    const handleModalClose = () => {
        if (bodyTestData) {
            DictBodyTestService.updateDictBodyTestTranslations(bodyTestData)
                .then(() => {
                    console.log('Body test updated successfully');
                })
                .catch(error => {
                    console.error('Error updating body test:', error);
                });
        }
        onClose();
    };

    return (
        <Modal show={show} onClose={handleModalClose} title="Body Test Details">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>{t("table.language")}</th>
                        <th>{t("table.name")}</th>
                        <th>{t("table.description")}</th>
                        <th>{t("table.purpose")}</th>
                    </tr>
                </thead>
                <tbody>
                    {LANGUAGES.map((language) => (
                        <tr key={language.code}>
                            <td>{language.label}</td>
                            <td>
                                <EditableCell
                                    value={bodyTestData?.name[language.code] || t('table.no_translation')}
                                    onSave={(newValue) => handleSave(language.code, newValue, bodyTestData?.description[language.code] || '', bodyTestData?.purpose[language.code] || '')}
                                />
                            </td>
                            <td>
                                <EditableCell
                                    value={bodyTestData?.description[language.code] || t('table.no_translation')}
                                    onSave={(newValue) => handleSave(language.code, bodyTestData?.name[language.code] || '', newValue, bodyTestData?.purpose[language.code] || '')}
                                />
                            </td>
                            <td>
                                <EditableCell
                                    value={bodyTestData?.purpose[language.code] || t('table.no_translation')}
                                    onSave={(newValue) => handleSave(language.code, bodyTestData?.name[language.code] || '', bodyTestData?.description[language.code] || '', newValue)}
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
