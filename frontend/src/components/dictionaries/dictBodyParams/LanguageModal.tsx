import React, { useEffect, useState } from 'react';
import Modal from '../../../constants/Modal';
import { LANGUAGES } from '../../../translations/Languages';
import DictBodyParamsService from '../../../services/dict/DictBodyParamsService';
import EditableCell from '../../../common/EditableCell';
import { TranslationsDictBodyParamsDto } from '../../../types/types';
import { useTranslation } from 'react-i18next';

interface LanguageModalProps {
    show: boolean;
    onClose: () => void;
    bodyParamId: number;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ show, onClose, bodyParamId }) => {
    const [bodyParamData, setBodyParamData] = useState<TranslationsDictBodyParamsDto | null>(null);
    const { t } = useTranslation("global");

    useEffect(() => {
        if (bodyParamId) {
            DictBodyParamsService.getDictBodyParamDetails(bodyParamId)
                .then(response => {
                    setBodyParamData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching body parameter details:', error);
                });
        }
    }, [bodyParamId]);

    const handleSave = (languageCode: string, newName: string, newDescription: string) => {
        if (bodyParamData) {
            const updatedData = {
                ...bodyParamData,
                name: {
                    ...bodyParamData.name,
                    [languageCode]: newName,
                },
                description: {
                    ...bodyParamData.description,
                    [languageCode]: newDescription,
                }
            };
            setBodyParamData(updatedData);
        }
    };

    const handleModalClose = () => {
        if (bodyParamData) {
            DictBodyParamsService.updateDictBodyParamTranslations(bodyParamData)
                .then(() => {
                    console.log('Body parameter updated successfully');
                })
                .catch(error => {
                    console.error('Error updating body parameter:', error);
                });
        }
        onClose();
    };

    return (
        <Modal show={show} onClose={handleModalClose} title="Body Parameter Details">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th>{t("table.language")}</th>
                        <th>{t("table.name")}</th>
                        <th>{t("table.description")}</th>
                    </tr>
                </thead>
                <tbody>
                    {LANGUAGES.map((language) => (
                        <tr key={language.code}>
                            <td>{language.label}</td>
                            <td>
                                <EditableCell
                                    value={bodyParamData?.name[language.code] || t('table.no_translation')}
                                    onSave={(newValue) => handleSave(language.code, newValue, bodyParamData?.description[language.code] || '')}
                                />
                            </td>
                            <td>
                                <EditableCell
                                    value={bodyParamData?.description[language.code] || t('table.no_translation')}
                                    onSave={(newValue) => handleSave(language.code, bodyParamData?.name[language.code] || '', newValue)}
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
