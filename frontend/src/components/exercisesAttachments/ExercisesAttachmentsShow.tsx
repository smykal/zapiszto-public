import React, { useState } from 'react';
import Modal from '../../constants/Modal';
import AuthService from '../../services/auth.service';
import IUser from '../../types/user.type';
import ExerciseAttachmentsShowExercises from './ExerciseAttachmentsShowExercises';
import ExerciseAttachmentsShowDictExercises from './ExerciseAttachmentsShowDictExercises';
import ExerciseAttachmentsDeleteExercise from './ExerciseAttachmentsDeleteExercise';
import ExerciseAttachmentsDeleteDictExercise from './ExerciseAttachmentsDeleteDictExercise';



interface ExercisesAttachmentsShowProps {
  exerciseId?: string;
  clientId?: string;
  dictExerciseId?: string;
}

const ExercisesAttachmentsShow: React.FC<ExercisesAttachmentsShowProps> = ({ exerciseId, clientId, dictExerciseId }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentUser] = useState<IUser | null>(AuthService.getCurrentUser());

  const hasRole = (role: string): boolean =>
    currentUser?.roles?.includes(role) ?? false;

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Check Available Recordings</button>

      <Modal show={showModal} onClose={() => setShowModal(false)} title="Exercise Attachments">

        {exerciseId && (
          <>
            <ExerciseAttachmentsShowExercises
              exerciseId={exerciseId}
              clientId={clientId}
            />

            {hasRole("ROLE_USER") && (
              <ExerciseAttachmentsDeleteExercise exerciseId={exerciseId} />
            )}
          </>
        )}

        {dictExerciseId && (
          <>
            <ExerciseAttachmentsShowDictExercises
              dictExerciseId={dictExerciseId}
            />

            {hasRole("ROLE_TRAINER") && (
              <ExerciseAttachmentsDeleteDictExercise dictExerciseId={dictExerciseId} />
            )}
          </>
        )}

      </Modal>
    </div>
  );
};

export default ExercisesAttachmentsShow;