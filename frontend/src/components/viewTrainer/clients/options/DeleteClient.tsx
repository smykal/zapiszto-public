import React, { useEffect, useState } from 'react';
import ClientsService from '../../../../services/clients';
import { Client } from '../../../../types/types';
import { useTranslation } from 'react-i18next';
import Modal from '../../../../constants/Modal';

interface DeleteClientProps {
  client: Client;
  onClientDeleted: () => void;
}

const DeleteClient: React.FC<DeleteClientProps> = ({ client, onClientDeleted }) => {
  const { t } = useTranslation('global');
  const [showModal, setShowModal] = useState(false);
  const [isDeletable, setIsDeletable] = useState<boolean>(false);

  useEffect(() => {
    const fetchDeletableStatus = async () => {
      const result = await ClientsService.isClientDeletable(client.id);
      setIsDeletable(result);
    };
    fetchDeletableStatus();
  }, [client.id]);


  const handleDelete = async () => {
    if (isDeletable) {
      const confirmMessage = `${t('clients.confirm_delete')} ${client.clientName}`;
      if (window.confirm(confirmMessage)) {
        try {
          await ClientsService.deleteClient(client.id);
          onClientDeleted();
          console.log('Client deleted successfully');
        } catch (error) {
          console.error('Error deleting client:', error);
        }
      }
    } else {
      // Pokazujemy modal z komunikatem
      setShowModal(true);
    }
  };

  return (
    <div>
      <button
        onClick={handleDelete}
        className="buttonDelete field"
      >
        {t('buttons.delete_client')}
      </button>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={t('validation.information')}
      >
        <p>{t('clients.delete_client_message')}</p>
      </Modal>
    </div>
  );
};

export default DeleteClient;
