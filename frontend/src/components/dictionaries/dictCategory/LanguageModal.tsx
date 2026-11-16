import React, { useEffect, useState } from 'react';
import Modal from '../../../constants/Modal';
import { LANGUAGES } from '../../../translations/Languages';
import Service from '../../../services/dict/DictCategoryService';
import EditableCell from '../../../common/EditableCell';
import { useTranslation } from 'react-i18next';

interface LanguageModalProps {
  show: boolean;
  onClose: () => void;
  categoryId: string;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ show, onClose, categoryId }) => {
  const [categoryData, setCategoryData] = useState<any | null>(null);
  const { t } = useTranslation("global");

  useEffect(() => {
    if (categoryId) {
      Service.getDictCategoryDetails(categoryId)
        .then(response => {
          setCategoryData(response.data);
        })
        .catch(error => {
          console.error('Error fetching category details:', error);
        });
    }
  }, [categoryId]);

  const handleSave = (languageCode: string, newName: string, newDescription: string) => {
    if (categoryData) {
      const updatedData = {
        ...categoryData,
        name: {
          ...categoryData.name,
          [languageCode]: newName,
        },
        description: {
          ...categoryData.description,
          [languageCode]: newDescription,
        },
      };
      setCategoryData(updatedData);
    }
  };

  const handleModalClose = () => {
    if (categoryData) {
      Service.updateDictCategoryNameDescription(categoryData)
        .then(() => {
          console.log('Category updated successfully');
        })
        .catch(error => {
          console.error('Error updating category:', error);
        });
    }
    onClose();
  };

  return (
    <Modal show={show} onClose={handleModalClose} title="Category Details">
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
                  value={categoryData?.name[language.code] || t('table.no_translation')}
                  onSave={(newValue) => handleSave(language.code, newValue, categoryData?.description[language.code] || '')}
                />
              </td>
              <td>
                <EditableCell
                  value={categoryData?.description[language.code] || t('table.no_translation')}
                  onSave={(newValue) => handleSave(language.code, categoryData?.name[language.code] || '', newValue)}
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
