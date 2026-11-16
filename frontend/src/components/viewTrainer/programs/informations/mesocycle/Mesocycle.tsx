import React, { useEffect, useState } from "react";
import { MesocycleDto } from "../../../../../types/types";
import MesocycleService from "../../../../../services/mesocycle/MesocycleService";
import { useTranslation } from "react-i18next";
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import Microcycle from "../microcycle/Microcycle";
import EditableCell from '../../../../../common/EditableCell';
import DeleteMesocycle from './DeleteMesocycle'; // Import DeleteMesocycle component
import AddSingleMesocycle from './AddSingleMesocycle'; // Import AddMesocycle component
import Modal from '../../../../../constants/Modal'; // Import Modal component

interface MesocycleProps {
  macrocycleId: string;
  initialDurationLeft: number;
  selectedTab: number;
  onSelectTab: (index: number) => void;
}

const Mesocycle: React.FC<MesocycleProps> = ({ macrocycleId, initialDurationLeft, selectedTab, onSelectTab }) => {
  const [mesocycles, setMesocycles] = useState<MesocycleDto[]>([]);
  const [message, setMessage] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false); // State for modal visibility
  const { t } = useTranslation('global');

  useEffect(() => {
    loadMesocycles();
  }, [macrocycleId]);

  useEffect(() => {
    localStorage.setItem(`mesocycle_${macrocycleId}_selectedTab`, selectedTab.toString());
  }, [selectedTab, macrocycleId]);

  const loadMesocycles = (newMesocycleId?: string) => {
    MesocycleService.getMesocycles(macrocycleId)
      .then(response => {
        const sortedMesocycles = response.data.sort((a: MesocycleDto, b: MesocycleDto) => a.orderId - b.orderId);
        setMesocycles(sortedMesocycles);
      })
      .catch(error => {
        console.error('Error loading mesocycles:', error);
        setMessage(t('mesocycle.loading_error'));
      });
  };

  const handleSaveLabel = (id: string, newLabel: string) => {
    MesocycleService.updateMesocycleLabel(id, newLabel)
      .then(() => {
        setMesocycles((prevMesocycles) =>
          prevMesocycles.map((mesocycle) =>
            mesocycle.id === id ? { ...mesocycle, label: newLabel } : mesocycle
          )
        );
      })
      .catch(error => {
        console.error('Error updating label:', error);
        setMessage(t('mesocycle.update_error'));
      });
  };

  const handleSaveComment = (id: string, newComment: string) => {
    MesocycleService.updateMesocycleComment(id, newComment)
      .then(() => {
        setMesocycles((prevMesocycles) =>
          prevMesocycles.map((mesocycle) =>
            mesocycle.id === id ? { ...mesocycle, comments: newComment } : mesocycle
          )
        );
      })
      .catch(error => {
        console.error('Error updating comment:', error);
        setMessage(t('mesocycle.update_error'));
      });
  };

  const handleMesocycleDeleted = () => {
    loadMesocycles();  // Reload mesocycles after one is deleted
  };

  const handleAddMesocycle = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleMesocycleAdded = () => {
    setShowModal(false);
    loadMesocycles();  // Reload mesocycles after adding a new one
  };

  return (
    <div>
      {message && <p>{message}</p>}
      <Tabs selectedIndex={selectedTab} onSelect={(index) => onSelectTab(index)}>
        <TabList>
          <Tab disabled>{t('macrocycle.month')}</Tab>
          {mesocycles.map((mesocycle) => (
            <Tab key={mesocycle.id}>{mesocycle.label || mesocycle.orderId}</Tab>
          ))}
          <Tab onClick={handleAddMesocycle}>+</Tab> {/* Tab with plus sign */}
        </TabList>
        <TabPanel/>
        {mesocycles.map((mesocycle) => (
          <TabPanel key={mesocycle.id}>
            <DeleteMesocycle mesocycle={mesocycle} onMesocycleDeleted={handleMesocycleDeleted} />
            <div className='program-content'>
              <p>
                {t('table.label')}:{' '}
                <EditableCell value={mesocycle.label || ''} onSave={(newLabel) => handleSaveLabel(mesocycle.id, newLabel)} />
              </p>
              <p>{t('table.duration')}: {mesocycle.duration} tygodnie</p>
              <p>
                {t('table.comments')}:{' '}
                <EditableCell value={mesocycle.comments || ''} onSave={(newComment) => handleSaveComment(mesocycle.id, newComment)} />
              </p>
              <p>{t('table.dict_mesocycle_phase')}: {mesocycle.dictName}</p>
            </div>
            <Microcycle mesocycleId={mesocycle.id} />
          </TabPanel>
        ))}
      </Tabs>
      <Modal show={showModal} onClose={handleModalClose} title={t('mesocycle.add_button')}>
        <AddSingleMesocycle macrocycleId={macrocycleId} onMesocycleAdded={handleMesocycleAdded} />
      </Modal>
    </div>
  );
};

export default Mesocycle;