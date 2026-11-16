import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ClientsService from '../../../../services/clients';
import InvitationsService from '../../../../services/invitations';
import { NewClient, MatchedInvitations, Client } from '../../../../types/types';

interface AddClientFormProps {
  onClientAdded: (newClient: Client) => void;
  existingClients: Client[];
}

const AddClientForm: React.FC<AddClientFormProps> = ({ onClientAdded, existingClients }) => {
  const [matchedInvitations, setMatchedInvitations] = useState<MatchedInvitations[]>([]);
  const [selectedInviteeId, setSelectedInviteeId] = useState<number | null>(null);
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
    setSelectedInviteeId(parseInt(e.target.value, 10));
  };

  const handleAddClient = async (values: NewClient, { setSubmitting, resetForm }: any) => {
    try {
      const newClientWithId: Client = {
        ...values,
        id: crypto.randomUUID(),
        userId: selectedInviteeId || 0,
        userName: null
      };
      await ClientsService.postNewClient(newClientWithId);
      resetForm();
      setSelectedInviteeId(null);
      onClientAdded(newClientWithId);
    } catch (error) {
      console.error('Error adding client:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    clientName: Yup.string()
      .test('unique-clientName', t('clients.client_name_exists'), value => {
        return !existingClients.some(client => client.clientName === value);
      })
      .required(t('validation.this_field_is_required')),
  });

  return (
    <div>
      <Formik
        initialValues={{ id: '', clientName: '', userId: 0 }}
        validationSchema={validationSchema}
        onSubmit={handleAddClient}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <Field type="text" name="clientName" className='field' placeholder={t('clients.client_name')} />
              <ErrorMessage name="clientName" component="div" />
            </div>
            <div>
              <select value={selectedInviteeId || ''} onChange={handleInviteeChange} className='field'>
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
            <div>{t('clients.assign_purpose')}</div>
            <button type="submit" disabled={isSubmitting} className='field'>
              {t('buttons.add')}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddClientForm;
