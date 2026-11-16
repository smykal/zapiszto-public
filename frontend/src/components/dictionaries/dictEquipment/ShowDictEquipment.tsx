import React, { useState, useEffect } from "react";
import { DictEquipment } from "../../../types/types";
import DictEquipmentService from '../../../services/dict/DictEquipmentService';
import AddDictEquipmentPerUser from "./AddDictEquipment";
import Options from "./Options";
import LanguageModal from "./LanguageModal";
import { useTranslation } from "react-i18next";
import AuthService from '../../../services/auth.service';
import IUser from '../../../types/user.type';
import Modal from "../../../constants/Modal";

const ShowDictEquipment: React.FC = () => {
  const [dictEquipment, setDictEquipment] = useState<DictEquipment[]>([]);
  const [showBasic, setShowBasic] = useState(true);
  const [showPerUser, setShowPerUser] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAddItemVisible, setModalAddItemVisible] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const { t } = useTranslation("global");
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) setCurrentUser(user);
    loadDictEquipment();
  }, []);

  const loadDictEquipment = () => {
    DictEquipmentService.getDictEquipment()
      .then(response => setDictEquipment(response.data))
      .catch(error => console.error('Error loading dict equipment:', error));
  };

  const hasRole = (role: string): boolean => {
    return currentUser?.roles?.includes(role) ?? false;
  };

  const handleAddEquipment = (newEquipment: DictEquipment) => {
    setDictEquipment(prev => [...prev, newEquipment]);
    setModalAddItemVisible(false);
  };

  const handleDeleteEquipment = (equipmentId: string) => {
    setDictEquipment(prev => prev.filter(e => e.dict_id !== equipmentId));
  };

  const handleShowBasicChange = () => setShowBasic(!showBasic);
  const handleShowPerUserChange = () => setShowPerUser(!showPerUser);

  const handleNameDoubleClick = (id: string, dict: string) => {
    if (
      (dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER"))) ||
      (dict === "BASIC" && hasRole("ROLE_ADMIN"))
    ) {
      setSelectedEquipmentId(id);
      setModalVisible(true);
    }
  };


  const filteredEquipment = [...dictEquipment]
    .filter(e => (showBasic && e.dict === "BASIC") || (showPerUser && e.dict === "PER_USER"))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5em', marginBottom: '1em' }}>
        <label>
          <input type="checkbox" checked={showBasic} onChange={handleShowBasicChange} />
          {t('dictionaries.basic')}
        </label>
        <label>
          <input type="checkbox" checked={showPerUser} onChange={handleShowPerUserChange} />
          {t('dictionaries.per_user')}
        </label>
      </div>

      <button onClick={() => setModalAddItemVisible(true)} className="field">{t("buttons.add")}</button>

      <table className="fixed-table" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>{t("table.name")}</th>
            <th>{t("table.options")}</th>
          </tr>
        </thead>
        <tbody>
          {filteredEquipment.map((row) => {
            const isEditable =
              (row.dict === "BASIC" && hasRole("ROLE_ADMIN")) ||
              (row.dict === "PER_USER" && (hasRole("ROLE_TRAINER") || hasRole("ROLE_USER")));

            return (
              <tr key={row.id}>
                <td
                  onDoubleClick={() => handleNameDoubleClick(row.dict_id, row.dict)}
                  style={{
                    cursor: isEditable ? 'pointer' : 'default',
                    color: isEditable ? 'inherit' : 'var(--color03)'
                  }}
                >
                  {row.name}
                </td>
                <td style={{
                  cursor: isEditable ? 'pointer' : 'default',
                  color: isEditable ? 'inherit' : 'var(--color03)'
                }}>
                  {isEditable ? (
                    <Options
                      item={row.dict_id}
                      dict={row.dict}
                      onDeleteEquipment={handleDeleteEquipment}
                      onEditEquipment={handleNameDoubleClick}
                    />
                  ) : (
                    <img
                      src="/images/navigation/options.svg"
                      alt="Options"
                      className="options-icon disabled"
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal show={modalAddItemVisible} onClose={() => setModalAddItemVisible(false)} title={t("buttons.add_equipment")}>
        <AddDictEquipmentPerUser dictEquipment={dictEquipment} onAddEquipment={handleAddEquipment} />
      </Modal>

      <LanguageModal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        equipmentId={selectedEquipmentId!}
      />
    </div>
  );
};

export default ShowDictEquipment;