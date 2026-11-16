import React from 'react';
import { useDeleteExerciseAttachment } from '../../services/exercisesAttachments/ExercisesAttachmentsService';
import Spinner from '../../common/Spinner';

interface ExerciseAttachmentsDeleteDictExerciseProps {
  dictExerciseId: string;
}

const ExerciseAttachmentsDeleteDictExercise: React.FC<ExerciseAttachmentsDeleteDictExerciseProps> = ({ dictExerciseId }) => {
  const mutation = useDeleteExerciseAttachment();

  const handleDelete = () => {
    mutation.mutate({ dictExerciseId });
  };

  return (
    <button onClick={handleDelete} disabled={mutation.status === 'pending'}>
      {mutation.status === 'pending' ? <Spinner /> : 'Delete Attachment'}
    </button>
  );
};

export default ExerciseAttachmentsDeleteDictExercise;