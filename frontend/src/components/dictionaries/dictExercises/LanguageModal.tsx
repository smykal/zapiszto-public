import React, { useEffect, useState } from 'react';
import Modal from '../../../constants/Modal';
import { LANGUAGES } from '../../../translations/Languages';
import Service from '../../../services/dict/DictExercisesService';
import EditableCell from '../../../common/EditableCell';
import { useTranslation } from 'react-i18next';
import { TranslationsDictExercisesDto } from '../../../types/types';

interface LanguageModalProps {
  show: boolean;
  onClose: () => void;
  exerciseId: string;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ show, onClose, exerciseId }) => {
  const [translations, setTranslations] = useState<TranslationsDictExercisesDto | null>(null);
  const { t } = useTranslation("global");

  useEffect(() => {
    if (exerciseId) {
      Service.getDictExerciseDetails(exerciseId)
        .then(response => {
          setTranslations(response.data);
        })
        .catch(error => {
          console.error('Error fetching exercise details:', error);
        });
    }
  }, [exerciseId]);

  const handleSave = (languageCode: string, newValue: string) => {
    if (translations) {
      const updatedTranslations = {
        ...translations,
        name: {
          ...translations.name,
          [languageCode]: newValue,
        },
      };
      setTranslations(updatedTranslations);
    }
  };

  const handleModalClose = () => {
    if (translations) {
      Service.updateDictExerciseName(translations)
        .then(() => {
          console.log('Translations updated successfully');
        })
        .catch(error => {
          console.error('Error updating translations:', error);
        });
    }
    onClose();
  };

  return (
    <Modal show={show} onClose={handleModalClose} title="Exercise Details">
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>{t('table.language')}</th>
            <th>{t('table.value')}</th>
          </tr>
        </thead>
        <tbody>
          {LANGUAGES.map((language) => (
            <tr key={language.code}>
              <td>{language.label}</td>
              <td>
                <EditableCell
                  value={translations?.name[language.code] || t('table.no_translation')}
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
