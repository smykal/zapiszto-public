import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Client } from '../../../../types/types';
import AddGoals from './AddGoals';
import GetGoals from './GetGoals';
import { useGetGoals } from '../../../../services/goals/GoalsTanstackService';
import Modal from '../../../../constants/Modal';

interface ClientDetailsProps {
  client: Client;
}

const ClientGoals: React.FC<ClientDetailsProps> = ({ client }) => {
  const { t } = useTranslation('global');
  const [showModal, setShowModal] = useState(false);
  const { data: goals = [], refetch } = useGetGoals(client.id);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div>
      <GetGoals goals={goals}
        onGoalUpdated={() => { void refetch(); }}
        onGoalDeleted={() => { void refetch(); }}
      />
      <span className="center">
        <button
          onClick={handleOpenModal}
          className="width_15rem">
          {t('buttons.add_goal')}
        </button>
      </span>


      <Modal show={showModal} onClose={handleCloseModal} title={t('buttons.add_goal')}>
        <AddGoals client={client} onGoalAdded={async () => {
          await refetch();
          handleCloseModal();
        }} />
      </Modal>
    </div>
  );
};

export default ClientGoals;
