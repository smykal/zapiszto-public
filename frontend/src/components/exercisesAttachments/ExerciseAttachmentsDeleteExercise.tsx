import React from 'react';
import { useDeleteExerciseAttachment } from '../../services/exercisesAttachments/ExercisesAttachmentsService';
import Spinner from '../../common/Spinner';

interface ExerciseAttachmentsDeleteExerciseProps {
  exerciseId: string;
}

const ExerciseAttachmentsDeleteExercise: React.FC<ExerciseAttachmentsDeleteExerciseProps> = ({ exerciseId }) => {
  const mutation = useDeleteExerciseAttachment();

  const handleDelete = () => {
    mutation.mutate({ exerciseId });
  };

  return (
    <button onClick={handleDelete} disabled={mutation.status === 'pending'}>
      {mutation.status === 'pending' ? <Spinner /> : 'Delete Attachment'}
    </button>
  );
};

export default ExerciseAttachmentsDeleteExercise;