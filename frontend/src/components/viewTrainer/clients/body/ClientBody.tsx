import React from 'react';
import { useTranslation } from 'react-i18next';
import { Client } from '../../../../types/types';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import ClientBodyParams from './bodyParams/ClientBodyParams';
import ClientBodyTests from './bodyTests/ClientBodyTests';
import BodyPhotos from '../../../bodyParams/bodyPhotos/BodyPhotos';


interface ClientDetailsProps {
    client: Client
}

const ClientBody: React.FC<ClientDetailsProps> =  ({client}) => {
    const { t } = useTranslation('global');
  return (
    <div>
      <Tabs>
        <TabList>
            <Tab key="tests">{t('body_params.tests')}</Tab>
            <Tab key="body_params">{t('body_params.body_measurements')}</Tab>
            <Tab key="body_photos">{t('body_params.body_photos')}</Tab>
        </TabList>
            <TabPanel key="tests"> <ClientBodyTests client={client} /></TabPanel>
            <TabPanel key="body_params"> <ClientBodyParams client={client} /> </TabPanel>
            <TabPanel key="body_photos"> <BodyPhotos clientId={client.id} /> </TabPanel>
      </Tabs>
    </div>
  );
};
export default ClientBody

