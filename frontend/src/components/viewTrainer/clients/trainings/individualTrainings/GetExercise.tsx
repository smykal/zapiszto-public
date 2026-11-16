import React, { Component } from 'react';
import { Exercise } from '../../../../../types/types';
import { withTranslation } from "react-i18next";
import ExercisesService from '../../../../../services/exercises';
import ExercisesAttachmentsShow from '../../../../exercisesAttachments/ExercisesAttachmentsShow';

type Props = {
    training_id: number;
    userId: number;
    t: any;
}

type State = {
    exercises: Exercise[];
}

class GetExercise extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            exercises: [],
        };
    }

    componentDidMount() {
        this.loadExercises();
    }

    loadExercises() {
        const { training_id, userId } = this.props;
        ExercisesService.getExercisesByUserId(training_id, userId)
            .then(response => {
                this.setState({ exercises: response.data });
            })
            .catch(error => {
                console.error('Error loading exercises:', error);
            });
    }

    render() {
        const { exercises } = this.state;
        return (
            <div>
                <table className="fixed-table">
                    <thead>
                        <tr>
                            <th className="column-large">{/*t("table.exercise")*/} &nbsp;</th>
                            <th className="column-small">{/*t("table.quantity")*/} &nbsp;</th>
                            <th className="column-small">{/*t("table.volume")*/} &nbsp;</th>
                            <th className='column-medium'>{/*t("table.notes")*/} &nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exercises.map((row) => (
                            <tr key={row.dictExerciseName} style={{ borderBottom: '1px solid #ddd' }}>
                                <td className="column-large">{row.dictExerciseName} {String(row.hasAttachment)}
                                    {row.hasAttachment && <ExercisesAttachmentsShow exerciseId={row.exerciseId} />}
                                </td>
                                <td className="column-small">{row.quantity} &nbsp; {row.dictQuantityTypeName}</td>
                                <td className="column-small">{row.volume} &nbsp; {row.dictUnitName}</td>
                                <td className='column-medium'>{row.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withTranslation("global")(GetExercise);
