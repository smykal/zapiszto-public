import React, { useEffect, useState } from 'react';
import SessionService from '../../../../../services/sessions/SessionsService';
import { SessionDto } from '../../../../../types/types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useTranslation } from 'react-i18next';
import GetExerciseSession from '../exercises/GetExerciseSession';
import DeleteSession from './options/DeleteSession'; // Importujemy nowy komponent
import EditSessionDate from './options/EditSessionDate'; // Importujemy komponent do edycji daty sesji

interface SessionProps {
  microcycleId: string;
  mesocycleId: string;
}

const Session: React.FC<SessionProps> = ({ microcycleId, mesocycleId }) => {
  const { t } = useTranslation('global');
  const [sessions, setSessions] = useState<SessionDto[]>([]);
  const [message, setMessage] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<SessionDto | null>(null);
  const [, setNewDateTime] = useState<Date | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    () => parseInt(localStorage.getItem(`session_${microcycleId}_selectedTab`) || '0')
  );

  useEffect(() => {
    loadSessions();
  }, [microcycleId]);

  useEffect(() => {
    localStorage.setItem(`session_${microcycleId}_selectedTab`, selectedIndex.toString());
  }, [selectedIndex, microcycleId]);

  const loadSessions = (newSessionId?: string) => {
    SessionService.getSessions(microcycleId)
      .then(response => {
        const sortedSessions = response.data.sort((a: SessionDto, b: SessionDto) => a.orderId - b.orderId);
        setSessions(sortedSessions);
        if (newSessionId) {
          const newIndex = sortedSessions.findIndex((session: SessionDto) => session.id === newSessionId);
          setSelectedIndex(newIndex !== -1 ? newIndex : 0);
        } else {
          const storedIndex = parseInt(localStorage.getItem(`session_${microcycleId}_selectedTab`) || '0');
          setSelectedIndex(storedIndex < sortedSessions.length ? storedIndex : 0);
        }
      })
      .catch(error => {
        console.error('Error loading sessions:', error);
        setMessage(t('session.loading_error'));
      });
  };

  const handleOpenModal = (session: SessionDto) => {
    setCurrentSession(session);
    setNewDateTime(session.dateTime ? new Date(session.dateTime) : null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentSession(null);
    setNewDateTime(null);
  };

  const handleAddSession = () => {
    SessionService.addSession(microcycleId)
      .then(response => {
        const newSession = response.data;
        loadSessions(newSession.id);
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          const alertMessage = t('session.too_many_sessions_error');
          window.alert(alertMessage);
          setMessage('');
        } else {
          console.error('Error adding session:', error);
          setMessage(t('session.add_error'));
        }
      });
  };

  const handleSessionDeleted = () => {
    loadSessions();
    handleCloseModal();
  };

  return (
    <div>
      {message && <p>{message}</p>}
      <Tabs selectedIndex={selectedIndex} onSelect={(index) => setSelectedIndex(index)}>
        <TabList>
          <Tab disabled>{t('session.session')}</Tab>
          {sessions.map((session) => (
            <Tab key={session.id}>{session.orderId}</Tab>
          ))}
          <Tab onClick={handleAddSession}>+</Tab>
        </TabList>
        <TabPanel/>
        {sessions.map((session) => (
          <TabPanel key={session.id}>
            <div className='program-content'>
              <p><strong>{t('table.label')}:</strong> {session.label}</p>
              <p>
                <strong>{t('session.session_date')}:</strong> {session.dateTime ? new Date(session.dateTime).toLocaleString() : t('session.no_date')}
                <img
                  src="/images/navigation/edit.svg"
                  alt="Edit"
                  style={{ marginLeft: "10px", width: "16px", height: "16px", cursor: "pointer" }}
                  onClick={() => handleOpenModal(session)}
                />            </p>
            </div>
            <GetExerciseSession session_id={session.id} microcycle_id={microcycleId} mesocycle_id={mesocycleId} onSessionChanged={loadSessions} />
            <DeleteSession session={session} onSessionDeleted={handleSessionDeleted} />
          </TabPanel>
        ))}
      </Tabs>
      {/* <Modal show={showModal} onClose={handleCloseModal} title={t('session.edit_date')}>
        <DatePicker
          selected={newDateTime}
          onChange={(date: Date) => setNewDateTime(date)}
          showTimeSelect
          dateFormat="Pp"
        />
        <button onClick={handleSaveDateTime}>{t('buttons.save')}</button>
      </Modal> */}
      <EditSessionDate
        session={currentSession}
        show={showModal}
        onClose={handleCloseModal}
        onSaved={(updatedSession) => {
          setSessions(prev =>
            prev.map(s => s.id === updatedSession.id ? updatedSession : s)
              .sort((a, b) => a.orderId - b.orderId)
          );
        }}
      />
    </div>
  );
};

export default Session;