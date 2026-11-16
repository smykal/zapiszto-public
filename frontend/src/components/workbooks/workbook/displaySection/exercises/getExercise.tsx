import React, { useMemo } from 'react';
import { Exercise } from '../../../../../types/types';
import ExercisesAttachmentsShow from '../../../../exercisesAttachments/ExercisesAttachmentsShow';
import Options from './Options';
import { useGetExercises } from '../../../../../services/exercises/ExercisesTanstackService';

interface Props {
    training_id: number;
}

const GetExercise: React.FC<Props> = ({ training_id }) => {
    const { data: exercisesData = [], refetch } = useGetExercises(training_id);

    const exercises = useMemo(() => exercisesData as Exercise[], [exercisesData]);

    if (!exercises.length) return null;

    return (
        <div>
            <table className="fixed-table">
                <thead>
                    <tr>
                        <th className="column-large">{/*t("table.exercise")*/} &nbsp; </th>
                        <th className="column-small">{/*t("table.type")*/}</th>
                        <th className="column-small">{/*t("table.unit")*/}</th>
                        <th className='column-medium'>{/*t("table.notes")*/}</th>
                        <th className="column-small"> {/*t("table.options")*/}</th>
                    </tr>
                </thead>
                <tbody>
                    {exercises.map((row) => (
                        <tr key={row.exerciseId}>
                            <td className="column-large">
                                {row.dictExerciseName}
                                {row.hasAttachment && <ExercisesAttachmentsShow exerciseId={row.exerciseId} />}
                            </td>
                            <td className="column-small">{row.quantity} &nbsp; {row.dictQuantityTypeName}</td>
                            <td className="column-small">{row.volume} &nbsp; {row.dictUnitName}</td>
                            <td className='column-medium'>{row.notes}</td>
                            <td className="column-small">
                                <Options
                                    exerciseId={row.exerciseId}
                                    trainingId={row.trainingId}
                                    onExerciseUpdate={async () => {
                                        await refetch();
                                    }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GetExercise;
