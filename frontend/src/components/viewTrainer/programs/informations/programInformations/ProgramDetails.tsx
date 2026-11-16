import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProgramsService from '../../../../../services/programs';
import ClientsService from '../../../../../services/clients';
import { ProgramDetails as ProgramDetailsType, Client } from '../../../../../types/types';
import Modal from '../../../../../constants/Modal';
import Spinner from '../../../../../common/Spinner';

interface ProgramDetailsProps {
  programId: string;
  onAssignedClientChange: (clientId: string | null) => void;
}

const ProgramDetails: React.FC<ProgramDetailsProps> = ({ programId, onAssignedClientChange }) => {
  const { t } = useTranslation('global');
  const [programDetails, setProgramDetails] = useState<ProgramDetailsType | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedClientName, setSelectedClientName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [programRes, clientsRes] = await Promise.all([
          ProgramsService.getProgramDetails(programId),
          ClientsService.getClients(),
        ]);
        setProgramDetails(programRes.data);
        setClients(clientsRes.data);
        onAssignedClientChange(programRes.data.assignedClient);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [programId]);

  const handleAssignClient = async (newClientId: string) => {
    try {
      await ProgramsService.updateProgramAssignedClient(programId, newClientId);
      if (programDetails) {
        setProgramDetails({ ...programDetails, assignedClient: newClientId });
        onAssignedClientChange(newClientId);
      }
    } catch (error) {
      console.error("Error updating assigned client:", error);
    }
  };

  const openModal = () => {
    if (!programDetails?.assignedClient) {
      setSelectedClientName("");
    } else {
      const clientName = getClientName(programDetails.assignedClient);
      setSelectedClientName(clientName);
    }
    setShowModal(true);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.clientName : t("programs.no_client_assigned_yet");
  };

  const handleSave = async () => {
    const selectedClient = clients.find(c => c.clientName === selectedClientName);
    if (!selectedClient) return;

    try {
      await handleAssignClient(selectedClient.id);
      setShowModal(false);
    } catch (error) {
      console.error("Error while saving assigned client:", error);
    }
  };

  if (loading) return <Spinner />;
  if (!programDetails) return <p>Program details not found.</p>;

  return (
    <div>
      <p>
        {t("programs.assigned_client")}: &nbsp;
        {getClientName(programDetails.assignedClient)}
        <img
          src="/images/navigation/edit.svg"
          alt="Edit"
          style={{ marginLeft: "10px", width: "16px", height: "16px", cursor: "pointer" }}
          onClick={openModal}
        />
      </p>
      {/* {programDetails.assignedClient && (
        <CurrentUserGoals clientId={programDetails.assignedClient} />
      )} */}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={t("programs.edit_assigned_client")}
      >
        <select
          value={selectedClientName}
          onChange={(e) => setSelectedClientName(e.target.value)}
          className="field"
        >
          <option value="" disabled>{t('clients.select_client_to_assign')}</option>

          {clients.map(client => (
            <option key={client.id} value={client.clientName}>
              {client.clientName}
            </option>
          ))}
        </select>
        <br /><br />
        <button onClick={handleSave} className="field" disabled={selectedClientName === getClientName(programDetails.assignedClient)}>
          {t("buttons.save")}
        </button>
      </Modal>
    </div>
  );
};

export default ProgramDetails;
