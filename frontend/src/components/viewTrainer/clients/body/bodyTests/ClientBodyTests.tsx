import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Client, ClientBodyTest } from '../../../../../types/types';
import AddClientBodyTest from './AddClientBodyTest';
import GetClientBodyTest from './GetClientBodyTest';
import Modal from '../../../../../constants/Modal';

interface ClientDetailsProps {
  client: Client;
}

const ClientBodyTests: React.FC<ClientDetailsProps> = ({ client }) => {
  const { t } = useTranslation('global');
  const [bodyTests, setBodyTests] = useState<ClientBodyTest[]>([]);
  const [showModalClientTest, setShowModalClientTest] = useState<boolean>(false);
  const handleCloseClientTestModal = () => setShowModalClientTest(false);

  return (
    <div>
      <GetClientBodyTest client={client} bodyTests={bodyTests} setBodyTests={setBodyTests} />

      <button onClick={() => setShowModalClientTest(true)}>{t('buttons.add_new_test')}</button>

      <Modal show={showModalClientTest} onClose={() => setShowModalClientTest(false)} title={t('buttons.add_new_test')}>
        <AddClientBodyTest
          client={client}
          onClose={handleCloseClientTestModal} />
      </Modal>
    </div>
  );
};

export default ClientBodyTests;
