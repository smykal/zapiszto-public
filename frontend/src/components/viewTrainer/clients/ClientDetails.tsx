import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Client } from '../../../types/types';
import ClientInformations from './informations/ClientInformations';
import ClientBody from './body/ClientBody';
import ClientGoals from './goals/ClientGoals';
import ClientTrainings from './trainings/ClientTrainings';
import Collapsible from 'react-collapsible';
import Options from './options/Options';

interface ClientDetailsProps {
  client: Client;
  onClientDeleted: () => void;
  onClientUpdated: () => void; 
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client, onClientDeleted, onClientUpdated }) => {
  const { t } = useTranslation('global');
  const [age, setAge] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);

  return (
    <div>
      <Collapsible
        trigger={
          <div className="collapsible-element"
            style={{
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <span>
              {client.clientName}
              {age ? ` (${age})` : ""}
              {gender ? `, ${gender}` : ""}
              {/* {t("clients.informations")} */}
            </span>
            <div onClick={(e) => e.stopPropagation()}>
              <Options
                client={client}
                onClientDeleted={onClientDeleted}
                onClientUpdated={onClientUpdated} 
              />
            </div>
          </div>
        }
        open={true}
      >
        <ClientInformations
          client={client}
          onClientDeleted={onClientDeleted}
          onAgeLoaded={setAge}
          onGenderLoaded={setGender} // przekaż setter gender
        />
      </Collapsible>

      <Collapsible
        trigger={
          <div className="collapsible-element">
            <span>{t("clients.body")}</span>
          </div>
        }
        open={false}
      >
        <ClientBody client={client} />
      </Collapsible>

      <Collapsible
        trigger={
          <div className="collapsible-element">
            <span>{t("clients.goals")}</span>
          </div>
        }
        open={false}
      >
        <ClientGoals client={client} />
      </Collapsible>

      <Collapsible
        trigger={
          <div className="collapsible-element">
            <span>{t("clients.trainings")}</span>
          </div>
        }
        open={false}
      >
        <ClientTrainings client={client} />
      </Collapsible>
    </div>
  );
};

export default ClientDetails;
