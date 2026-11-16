import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useGetAgeByUserId,
  useGetGenderByUserId,
} from '../../../../services/bodyParams/BodyParamsTanstackService';
import ClientsService from '../../../../services/clients';
import UpdateClientUser from '../options/UpdateClientUser';
import { Client } from '../../../../types/types';
import ProgramsService from '../../../../services/programs';
import { Program } from '../../../../types/types';
import Spinner from '../../../../common/Spinner';

interface ClientDetailsProps {
  client: Client;
  onClientDeleted: () => void;
  onAgeLoaded?: (age: string | null) => void;
  onGenderLoaded?: (gender: string | null) => void; // dodaj ten props
}

const ClientInformations: React.FC<ClientDetailsProps> = ({ client, onClientDeleted, onAgeLoaded, onGenderLoaded }) => {
  const { t } = useTranslation('global');
  const [clientData, setClientData] = useState<Client | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [assignedUserId, setAssignedUserId] = useState<number>(client.userId);
  const [assignedUserName, setAssignedUserName] = useState<string | null>(client.userName);
  const { data: genderData, isError: isGenderError } = useGetGenderByUserId(assignedUserId);
  const { data: ageData, isError: isAgeError } = useGetAgeByUserId(assignedUserId);

  useEffect(() => {
    if (assignedUserId <= 0 || isGenderError) {
      onGenderLoaded?.(null);
      return;
    }

    if (genderData) {
      onGenderLoaded?.(genderData.gender);
    }
  }, [assignedUserId, genderData, isGenderError, onGenderLoaded]);

  useEffect(() => {
    if (assignedUserId <= 0 || isAgeError) {
      onAgeLoaded?.(null);
      return;
    }

    if (ageData) {
      onAgeLoaded?.(ageData.age);
    }
  }, [assignedUserId, ageData, isAgeError, onAgeLoaded]);

  useEffect(() => {
    if (client) {
      ClientsService.getClient(client.id)
        .then(response => {
          setClientData(response.data);
          setAssignedUserId(response.data.userId);
          setAssignedUserName(response.data.userName);
        })
        .catch(error => {
          if (onAgeLoaded) onAgeLoaded(null);
          if (onGenderLoaded) onGenderLoaded(null);
          console.error('Error fetching client:', error);
        });
      ProgramsService.getProgramsByClientId(client.id)
        .then(response => setPrograms(response.data))
        .catch(error => console.error('Error fetching programs:', error));
    }
  }, [client, onAgeLoaded, onGenderLoaded]);

  const handleUserAssigned = (userId: number, userName: string) => {
    setAssignedUserId(userId);
    setAssignedUserName(userName);
    if (clientData) {
      setClientData({ ...clientData, userId, userName });
    }
  };

  if (!clientData) {
    return <Spinner />;
  }

  return (
    <div>
      {t('clients.client_assigned_user')}: {assignedUserId === 0
        ? <UpdateClientUser client={clientData} onUserAssigned={handleUserAssigned} />
        : assignedUserName}

      <div>
        <p>{t('clients.assigned_program')}:</p>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          {programs.length === 0 ? (
            <li>{t('clients.no_programs_yet')}</li>
          ) : (
            programs.map((program) => (
              <li key={program.id || program.programName}>
                {program.programName}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ClientInformations;
