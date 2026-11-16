import React, { useEffect, useState } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import PersonalTrainingsService from '../../../../../services/personalTrainings/PersonalTrainingsService';
import { ClientProgramDto, ClientProgramExerciseDto } from '../../../../../types/types';
import { useTranslation } from "react-i18next";
import Spinner from '../../../../../common/Spinner';

const PersonalTrainingsByUser: React.FC = () => {
  const [clientPrograms, setClientPrograms] = useState<ClientProgramDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation("global");

  useEffect(() => {
    const fetchClientPrograms = async () => {
      try {
        const response = await PersonalTrainingsService.getClientProgramByUserId();
        setClientPrograms(response.data);
      } catch (error) {
        console.error('Error fetching client programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientPrograms();
  }, []);

  const renderExercisesTable = (exercises: ClientProgramExerciseDto[]) => {
    const sortedExercises = exercises.sort((a, b) => a.orderId - b.orderId);
    return (
      <div style={{ overflowX: "auto" }}>
        <table className="fixed-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Purpose</th>
              <th>{t("table.category")}</th>
              <th>{t("table.exercise")}</th>
              <th>{t("table.volume")}</th>
              <th>{/*Unit*/}</th>
              <th>{t("table.quantity")}</th>
              <th>{/*Unit*/}</th>
            </tr>
          </thead>
          <tbody>
            {sortedExercises.map(ex => (
              <tr key={ex.orderId}>
                <td>{ex.orderId}</td>
                <td>{ex.purpose}</td>
                <td>{ex.category}</td>
                <td>{ex.exercise}</td>
                <td>{ex.weight}</td>
                <td>{ex.weightUnit}</td>
                <td>{ex.repetitions}</td>
                <td>{ex.repetitionsUnit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderSessions = (sessions: any[]) => {
    return sessions.length > 1 ? (
      <Tabs>
        <TabList>
          {sessions.map((session, s) => (
            <Tab key={s}>{t("session.session")} {s + 1}</Tab>
          ))}
        </TabList>
        {sessions.map((session, s) => (
          <TabPanel key={s}>
            {renderExercisesTable(session.exercises)}
          </TabPanel>
        ))}
      </Tabs>
    ) : (
      renderExercisesTable(sessions[0]?.exercises || [])
    );
  };

  const renderMicrocycles = (microcycles: any[]) => {
    return microcycles.length > 1 ? (
      <Tabs>
        <TabList>
          {microcycles.map((micro, k) => (
            <Tab key={k}>{t("microcycle.week")} {k + 1}</Tab>
          ))}
        </TabList>
        {microcycles.map((micro, k) => (
          <TabPanel key={k}>
            {renderSessions(micro.sessions)}
          </TabPanel>
        ))}
      </Tabs>
    ) : (
      renderSessions(microcycles[0]?.sessions || [])
    );
  };

  const renderMesocycles = (mesocycles: any[]) => {
    return mesocycles.length > 1 ? (
      <Tabs>
        <TabList>
          {mesocycles.map((meso, j) => (
            <Tab key={j}>Mesocycle {j + 1}</Tab>
          ))}
        </TabList>
        {mesocycles.map((meso, j) => (
          <TabPanel key={j}>
            {renderMicrocycles(meso.microcycles)}
          </TabPanel>
        ))}
      </Tabs>
    ) : (
      renderMicrocycles(mesocycles[0]?.microcycles || [])
    );
  };

  const renderMacrocycles = (macrocycles: any[]) => {
    return macrocycles.length > 1 ? (
      <Tabs>
        <TabList>
          {macrocycles.map((macro, i) => (
            <Tab key={i}>Macrocycle {i + 1}</Tab>
          ))}
        </TabList>
        {macrocycles.map((macro, i) => (
          <TabPanel key={i}>
            {renderMesocycles(macro.mesocycles)}
          </TabPanel>
        ))}
      </Tabs>
    ) : (
      renderMesocycles(macrocycles[0]?.mesocycles || [])
    );
  };

  const renderPrograms = () => (
    <Tabs>
      <TabList>
        {clientPrograms.map((program, i) => (
          <Tab key={i}>{program.name}</Tab>
        ))}
      </TabList>
      {clientPrograms.map((program, i) => (
        <TabPanel key={i}>
          {renderMacrocycles(program.macrocycles)}
        </TabPanel>
      ))}
    </Tabs>
  );

  return (
    <>
      {loading ? (
        <Spinner />
      ) : clientPrograms.length === 0 ? (
        <p>{t("programs.no_program_found_for_user")}</p>
      ) : (
        renderPrograms()
      )}
    </>  
  );
};

export default PersonalTrainingsByUser;
