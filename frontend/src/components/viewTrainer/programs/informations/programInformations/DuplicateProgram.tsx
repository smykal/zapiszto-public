import React, { useState } from 'react';
import Modal from '../../../../../constants/Modal';
import { useTranslation } from 'react-i18next';

interface DuplicateProgramProps {
  programId: string;
  onDuplicateProgram: (id: string, newName: string) => void;
  closeParentModal: () => void;
}

const DuplicateProgram: React.FC<DuplicateProgramProps> = ({ programId, onDuplicateProgram, closeParentModal }) => {
  const { t } = useTranslation('global');
  const [showModal, setShowModal] = useState(false);
  const [newProgramName, setNewProgramName] = useState('');

  const handleDuplicate = () => {
    onDuplicateProgram(programId, newProgramName);
    setShowModal(false);
    closeParentModal(); 
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)} className='field'>
        {t('programs.duplicate')}
      </button>
      <Modal show={showModal} onClose={() => setShowModal(false)} title={t('programs.duplicate')}>
        <div>
          <input
            type="text"
            value={newProgramName}
            onChange={(e) => setNewProgramName(e.target.value)}
            placeholder={t('programs.new_program_name')}
            autoFocus
          />
          <button onClick={handleDuplicate}>
            {t('programs.duplicate')}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DuplicateProgram;
