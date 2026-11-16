import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InvitationsService from '../../../../services/invitations';
import ClientsService from '../../../../services/clients';
import { Client, MatchedInvitations } from '../../../../types/types';
import Modal from '../../../../constants/Modal';

interface UpdateClientUserProps {
  client: Client;
  onUserAssigned?: (userId: number, userName: string) => void; // Dodaj callback
}

const UpdateClientUser: React.FC<UpdateClientUserProps> = ({ client, onUserAssigned }) => {
  const [matchedInvitations, setMatchedInvitations] = useState<MatchedInvitations[]>([]);
  const [selectedInviteeId, setSelectedInviteeId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { t } = useTranslation('global');

  useEffect(() => {
    fetchMatchedInvitations();
  }, []);

  const fetchMatchedInvitations = async () => {
    try {
      const response = await InvitationsService.getMatchedInvitations();
      if (Array.isArray(response.data)) {
        setMatchedInvitations(response.data);
      } else {
        console.error('Unexpected response data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching matched invitations:', error);
    }
  };

  const handleInviteeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInviteeId(e.target.value);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInviteeId) {
      return;
    }
    try {
      await ClientsService.updateClientUser(client.id, Number(selectedInviteeId), client.clientName);
      // Pobierz nazwę użytkownika z matchedInvitations
      const assignedUser = matchedInvitations.find(inv => inv.userId === selectedInviteeId);
      if (onUserAssigned && assignedUser) {
        onUserAssigned(Number(selectedInviteeId), assignedUser.userName);
      }
      setShowModal(false); // Zamknij modal
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)} className="myButton">
        {t('clients.client_assign_user')}
      </button>

      <Modal show={showModal} onClose={() => setShowModal(false)} title={t('clients.client_assign_user')}>
        <div>
          <form onSubmit={handleUpdateUser}>
            <div className="form-group">
              <select value={selectedInviteeId || ''} onChange={handleInviteeChange} className="field">
                <option value="">{t('clients.select_user_to_assign')}</option>
                {matchedInvitations.map(invitation => (
                  <option
                    key={invitation.userId}
                    value={invitation.userId}
                    disabled={invitation.matched}
                    style={invitation.matched ? { color: "#aaa" } : {}}
                  >
                    {invitation.userName}
                    {invitation.matched ? ` (${t('clients.already_assigned')})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {t('clients.assign_purpose')}
            </div>
            <div className="form-group">
              <button type="submit" className="field">{t('clients.client_assign_user')}</button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default UpdateClientUser;
