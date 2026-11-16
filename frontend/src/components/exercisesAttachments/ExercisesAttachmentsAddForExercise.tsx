import React, { useState } from 'react';
import Modal from '../../constants/Modal';
import { useAddExerciseAttachment } from '../../services/exercisesAttachments/ExercisesAttachmentsService';
import Spinner from '../../common/Spinner';

interface ExercisesAttachmentsAddForExerciseProps {
  exerciseId: string;
}

const ExercisesAttachmentsAddForExercise: React.FC<ExercisesAttachmentsAddForExerciseProps> = ({ exerciseId }) => {
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
      mutation.mutate({ file, exerciseId });
      setShowModal(false);
      setFile(null);
    }
  };

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Add Attachment</button>

      <Modal show={showModal} onClose={() => setShowModal(false)} title="Upload Attachment">
        <div>
          <input type="file" onChange={handleFileChange} className="field"/>
          <div className="center">
            <button onClick={handleSubmit} disabled={mutation.status === 'pending'} className="field">
              {mutation.status === 'pending' ? <Spinner /> : 'Upload'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ExercisesAttachmentsAddForExercise;