import React from 'react';
import { useTranslation } from 'react-i18next';
import { Program } from '../../../types/types';
import ProgramInformations from './informations/programInformations/ProgramInformations';
import Collapsible from 'react-collapsible';
import Makrocykl from './informations/makrocykl/Makrocykl';
import Statistics from './informations/statistics/Statistics';
import Options from './informations/programInformations/Options';

interface ProgramDetailsProps {
  program: Program;
  onProgramDeleted: () => void;
  onSaveProgramName: (id: string, newName: string) => void;
  onDuplicateProgram: (id: string, newName: string) => void;
}

const ProgramInfo: React.FC<ProgramDetailsProps> = ({ program, onProgramDeleted, onSaveProgramName, onDuplicateProgram }) => {
  const { t } = useTranslation('global');

  return (
    <div>
      <Collapsible trigger={
        <div className="collapsible-element"
          style={{
            cursor: 'pointer',
            display: 'flex',         // Ustawienie na 'flex' sprawia, że elementy będą obok siebie
            flexDirection: 'row',    // Możesz użyć 'row', jeśli chcesz, aby były w poziomie
            alignItems: 'center',    // Opcjonalnie, wyrównanie elementów w poziomie
          }}>
          <span>{t("programs.informations")}</span>
          <div onClick={(e) => e.stopPropagation()}>
            <Options
              program={program}
              onDuplicateProgram={onDuplicateProgram}
              onProgramDeleted={onProgramDeleted}
              onSaveProgramName={onSaveProgramName} 
            />
          </div>
        </div>
      } open={true}>

        <ProgramInformations program={program} onSaveProgramName={onSaveProgramName} />
      </Collapsible>

      <Collapsible trigger={
        <div className="collapsible-element">
          <span>{t("programs.macrocicle")}</span>
        </div>} open={false}>
        <Makrocykl programId={program.id} />
      </Collapsible>

      <Collapsible trigger={
        <div className="collapsible-element">
          <span>{t("programs.statistics")}</span>
        </div>
      }
        open={false}>
        <Statistics programId={program.id} />
      </Collapsible>
    </div>
  );
};

export default ProgramInfo;
