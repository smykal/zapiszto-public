import React, { useState } from 'react';
import { Program } from '../../../../../types/types';
import ProgramDetails from './ProgramDetails';
import CurrentUserGoals from '../currentUserGoals/CurrentUserGoals';

interface ProgramInformationsProps {
  program: Program;
  onSaveProgramName: (id: string, newName: string) => void;
}

const ProgramInformations: React.FC<ProgramInformationsProps> = ({ program, onSaveProgramName }) => {
  const [assignedClientId, setAssignedClientId] = useState<string | null>(null);



  return (
    <>
      <ProgramDetails programId={program.id} onAssignedClientChange={setAssignedClientId} />
      {assignedClientId && (<CurrentUserGoals clientId={assignedClientId} />)}
    </>

  );
};

export default ProgramInformations;
