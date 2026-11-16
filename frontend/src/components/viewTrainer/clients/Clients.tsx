import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import { Client } from '../../../types/types';
import AddClientForm from './options/AddClientForm';
import ClientDetails from './ClientDetails';
import ClientsService from '../../../services/clients';
import Modal from '../../../constants/Modal';

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { t } = useTranslation('global');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await ClientsService.getClients();
      if (Array.isArray(response.data)) {
        setClients(response.data);
      } else {
        console.error('Unexpected response data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleClientAdded = (newClient: Client) => {
    setClients(prevClients => [...prevClients, newClient]);
    setActiveTabIndex(clients.length);
    setShowModal(false);
  };

  const handleClientDeleted = () => {
    fetchClients();
    setActiveTabIndex(0);
  };

   const handleClientUpdated = async () => {
    fetchClients();
  };

  return (
    <div className='card-container'>
        <Tabs selectedIndex={activeTabIndex} onSelect={setActiveTabIndex}>
          <TabList>
            {clients.map((client, index) => (
              <Tab key={client.id}>{client.clientName}</Tab>
            ))}
            <Tab onClick={() => setShowModal(true)}>+</Tab>
          </TabList>

          {clients.map(client => (
            <TabPanel key={client.id}>
              <ClientDetails client={client} onClientDeleted={handleClientDeleted} onClientUpdated={handleClientUpdated}/>
            </TabPanel>
          ))}
        </Tabs>

        <Modal show={showModal} onClose={() => setShowModal(false)} title={t('buttons.add_client')}>
          <AddClientForm onClientAdded={handleClientAdded} existingClients={clients} />
        </Modal>

        {clients.length === 0 && (
        <p>{t("clients.no_clients_yet")} </p>
    )}
    </div>
  );
};

export default Clients;
