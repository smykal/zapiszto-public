import React, { useEffect, useState } from 'react';
import MicrocycleService from '../../../../../services/microcycle/MicrocycleService';
import { MicrocycleDto } from '../../../../../types/types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useTranslation } from 'react-i18next';
import Session from '../session/Session';
import DeleteMicrocycle from './DeleteMicrocycle';

interface MicrocycleProps {
  mesocycleId: string;
}

const Microcycle: React.FC<MicrocycleProps> = ({ mesocycleId }) => {
  const { t } = useTranslation('global');
  const [microcycles, setMicrocycles] = useState<MicrocycleDto[]>([]);
  const [message, setMessage] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(parseInt(localStorage.getItem(`microcycle_${mesocycleId}_selectedIndex`) || '0'));

  useEffect(() => {
    loadMicrocycles();
  }, [mesocycleId]);

  useEffect(() => {
    localStorage.setItem(`microcycle_${mesocycleId}_selectedIndex`, selectedIndex.toString());
  }, [selectedIndex, mesocycleId]);

  const loadMicrocycles = () => {
    MicrocycleService.getMicrocycles(mesocycleId)
      .then(response => {
        const sortedMicrocycles = response.data.sort((a: MicrocycleDto, b: MicrocycleDto) => a.orderId - b.orderId);
        setMicrocycles(sortedMicrocycles);
      })
      .catch(error => {
        console.error('Error loading microcycles:', error);
        setMessage(t('microcycle.loading_error'));
      });
  };

  const handleAddMicrocycle = () => {
    MicrocycleService.addMicrocycle(mesocycleId)
      .then(response => {
        loadMicrocycles();
      })
      .catch(error => {
        console.error('Error adding microcycle:', error);
        setMessage(t('microcycle.add_error'));
      });
  };

  const handleShareChange = (microcycleId: string, share: boolean) => {
    MicrocycleService.updateMicrocycleShare(microcycleId, share)
      .then(() => {
        loadMicrocycles();
      })
      .catch(error => {
        console.error('Error updating microcycle share:', error);
        setMessage(t('microcycle.update_share_error'));
      });
  };

  return (
    <div>
      {message && <p>{message}</p>}
      <Tabs selectedIndex={selectedIndex} onSelect={(index) => setSelectedIndex(index)}>
        <TabList>
          <Tab disabled>{t('microcycle.week')}</Tab>
          {microcycles.map((microcycle) => (
            <Tab key={microcycle.id}>{microcycle.orderId}</Tab>
          ))}
          <Tab onClick={handleAddMicrocycle}>+</Tab>
        </TabList>
        <TabPanel/>
        {microcycles.map((microcycle) => (
          <TabPanel key={microcycle.id}>
            <DeleteMicrocycle microcycle={microcycle} onMicrocycleDeleted={loadMicrocycles} />
            <label>
              <input
                type="checkbox"
                checked={microcycle.share}
                onChange={(e) => handleShareChange(microcycle.id, e.target.checked)}
              />
              {t('microcycle.share')}
            </label>
            <Session microcycleId={microcycle.id} mesocycleId={mesocycleId} />
          </TabPanel>
        ))}
      </Tabs>
    </div>
  );
};

export default Microcycle;
