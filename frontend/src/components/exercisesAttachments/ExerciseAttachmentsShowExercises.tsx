import React from 'react';
import { useGetExerciseAttachmentsForExercise } from '../../services/exercisesAttachments/ExercisesAttachmentsService';
import ShowComments from '../comments/ShowComments';
import { ExerciseAttachmentDto } from '../../types/types';

interface ExerciseAttachmentsShowExercisesProps {
  exerciseId: string;
  clientId?: string;
}

const ExerciseAttachmentsShowExercises: React.FC<ExerciseAttachmentsShowExercisesProps> = ({ exerciseId, clientId }) => {
  const query = useGetExerciseAttachmentsForExercise(exerciseId, clientId || '');
  const data = query.data || [];

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {data.map((attachment: ExerciseAttachmentDto) => (
        <li key={attachment.id}>
          {attachment.extension === 'mp4' ? (
            <video controls width="400">
              <source src={attachment.photoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={attachment.photoUrl} alt="Attachment" width="400" />
          )}
          <p>{new Date(attachment.date).toLocaleDateString()}</p>
          <ShowComments origin="exercises_attachments" originId={attachment.id} />
        </li>
      ))}
    </ul>
  );
};

export default ExerciseAttachmentsShowExercises;