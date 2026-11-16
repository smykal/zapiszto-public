import React from 'react';
import { useGetExerciseAttachmentsForDictExercise } from '../../services/exercisesAttachments/ExercisesAttachmentsService';
import Spinner from '../../common/Spinner';
import { ExerciseAttachmentDto } from '../../types/types';
interface ExerciseAttachmentsShowDictExercisesProps {
  dictExerciseId: string;
}

const ExerciseAttachmentsShowDictExercises: React.FC<ExerciseAttachmentsShowDictExercisesProps> = ({ dictExerciseId }) => {
  const query = useGetExerciseAttachmentsForDictExercise(dictExerciseId);
  const data = query.data || [];

  if (query.isLoading) {
    return <Spinner />;
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
        </li>
      ))}
    </ul>
  );
};

export default ExerciseAttachmentsShowDictExercises;