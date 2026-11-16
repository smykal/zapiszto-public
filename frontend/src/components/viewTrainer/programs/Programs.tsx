import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import { Program } from '../../../types/types';
import AddProgramForm from './addProgram/AddProgramForm';
import ProgramDetails from './Program';
import ProgramsService from '../../../services/programs';
import Modal from '../../../constants/Modal';
//import 'react-tabs/style/react-tabs.css';

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { t } = useTranslation('global');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await ProgramsService.getPrograms();
      if (Array.isArray(response.data)) {
        const sortedPrograms = response.data.sort((a, b) => new Date(a.createDate).getTime() - new Date(b.createDate).getTime());
        setPrograms(sortedPrograms);
      } else {
        console.error('Unexpected response data format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleProgramAdded = (newProgram: Program) => {
    setPrograms(prevPrograms => [...prevPrograms, newProgram]);
    setActiveTabIndex(programs.length);
    setShowModal(false);
  };

  const handleProgramDeleted = () => {
    fetchPrograms();
    setActiveTabIndex(0);
  };

  const handleSaveProgramName = async (id: string, newName: string) => {
    try {
      await ProgramsService.updateProgramName(id, newName);
      fetchPrograms();
    } catch (error) {
      console.error('Error updating program name:', error);
    }
  };

  const handleDuplicateProgram = async (id: string, programName: string) => {
    try {
      await ProgramsService.duplicateProgram(id, programName);
      fetchPrograms();
    } catch (error) {
      console.error('Error duplicating program:', error);
    }
  };

  return (
    <div className='card-container'>
      <Tabs selectedIndex={activeTabIndex} onSelect={setActiveTabIndex}>
        <TabList>
          {programs.map((program, index) => (
            <Tab key={program.id}>{program.programName}</Tab>
          ))}
          <Tab onClick={() => setShowModal(true)}>+</Tab>
        </TabList>

        {programs.map(program => (
          <TabPanel key={program.id}>
            <ProgramDetails
              program={program}
              onProgramDeleted={handleProgramDeleted}
              onSaveProgramName={handleSaveProgramName}
              onDuplicateProgram={handleDuplicateProgram}
            />
          </TabPanel>
        ))}
      </Tabs>

      {programs.length === 0 && (
        <p>{t("programs.no_programs_yet")} </p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} title={t('buttons.add_program')}>
        <AddProgramForm onProgramAdded={handleProgramAdded} existingPrograms={programs} />
      </Modal>
    </div>
  );
};

export default Programs;
