import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import AddExercise from './addExercise';
import GetExercise from './getExercise';
import Modal from '../../../../../constants/Modal'; // Ścieżkę dostosuj do lokalizacji Twojego pliku modalnego

type Props = {
    workbook_id: number,
    training_id: number
    t: any;
}

const Exercise: React.FC<Props> = ({ workbook_id, training_id, t }) => {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRefresh = async () => {
        await queryClient.invalidateQueries({ queryKey: ['exercises', training_id] });
    };

    return (
        <div>
            <button onClick={() => setIsModalOpen(true)}>{t('buttons.add_exercise')}</button>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Exercise">
                <AddExercise
                    workbook_id={workbook_id}
                    training_id={training_id}
                    onRefresh={async () => {
                        await handleRefresh();
                        setIsModalOpen(false);
                    }}
                />
            </Modal>

            <GetExercise training_id={training_id} />
        </div>
    );
};

export default withTranslation('global')(Exercise);
