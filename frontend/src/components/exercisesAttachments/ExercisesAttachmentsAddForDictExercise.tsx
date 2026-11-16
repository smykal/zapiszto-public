import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../constants/Modal';
import { useAddExerciseAttachment } from '../../services/exercisesAttachments/ExercisesAttachmentsService';
import Spinner from '../../common/Spinner';

interface ExercisesAttachmentsAddForDictExerciseProps {
  dictExerciseId: string;
}

const ExercisesAttachmentsAddForDictExercise: React.FC<ExercisesAttachmentsAddForDictExerciseProps> = ({ dictExerciseId }) => {
  const { t } = useTranslation('global');
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const mutation = useAddExerciseAttachment();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (file) {
      mutation.mutate({ file, dictExerciseId });
      setShowModal(false);
      setFile(null);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="width_15rem">
        {t('buttons.add_attachment')}
      </button>

      <Modal show={showModal} onClose={() => setShowModal(false)} title={t('buttons.upload_attachment')}>
        <div>
          <input type="file" onChange={handleFileChange} />
          <button
            onClick={handleSubmit}
            disabled={mutation.status === 'pending'}
            className="width_15rem">
            {mutation.status === 'pending' ? <Spinner /> : t('buttons.upload')}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ExercisesAttachmentsAddForDictExercise;