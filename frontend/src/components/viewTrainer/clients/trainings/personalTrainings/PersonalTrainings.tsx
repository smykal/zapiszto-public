import React, { useEffect, useState } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import PersonalTrainingsService from '../../../../../services/personalTrainings/PersonalTrainingsService';
import { Client, ClientProgramDto, ClientProgramExerciseDto } from '../../../../../types/types';
import { useTranslation } from "react-i18next";
import EditableExecutedCell from '../../../../../common/EditableExecutedCell';
import ExercisesSessionService from '../../../../../services/exercises/session/ExercisesSessionService';
import ExercisesAttachmentsShow from '../../../../exercisesAttachments/ExercisesAttachmentsShow';
import Spinner from '../../../../../common/Spinner';
import SessionPart from '../../../../../common/SessionPart';

interface PersonalTrainingsProps {
    client: Client;
}

const PersonalTrainings: React.FC<PersonalTrainingsProps> = ({ client }) => {
    const [clientPrograms, setClientPrograms] = useState<ClientProgramDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeoutReached, setTimeoutReached] = useState(false);
    const { t } = useTranslation("global");

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        setLoading(true);
        setTimeoutReached(false);

        const fetchClientPrograms = async () => {
            try {
                const response = await PersonalTrainingsService.getClientProgramByClientId(client.id);
                setClientPrograms(response.data);
            } catch (error) {
                console.error('Error fetching client programs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClientPrograms();

        timeoutId = setTimeout(() => {
            setTimeoutReached(true);
            setLoading(false);
        }, 10000);

        return () => clearTimeout(timeoutId);
    }, [client.id]);

    if (loading && !timeoutReached) {
        return <Spinner />;
    }

    if ((timeoutReached && clientPrograms.length === 0) || (!loading && clientPrograms.length === 0)) {
        return <p>No programs found for client.</p>;
    }

    const renderExercisesTable = (exercises: ClientProgramExerciseDto[]) => {
        // Sortowanie ćwiczeń po orderId rosnąco
        const sortedExercises = exercises.sort((a, b) => a.orderId - b.orderId);

        return (
            <table className="fixed-table">
                <thead>
                    <tr>
                        <th className="column-small">Purpose</th>
                        <th>Category</th>
                        <th>Exercise</th>
                        <th>Weight</th>
                        <th>Repetitions</th>
                        <th>Repetitions Unit</th>
                        <th>Executed</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedExercises.map(exercise => (
                        <tr key={exercise.orderId}>
                            <td className="column-small"><SessionPart purposeId={exercise.purposeId} purposeName={exercise.purpose}/></td>
                            <td>{exercise.category}</td>
                            <td>{exercise.exercise}
                                {exercise.hasAttachment && <ExercisesAttachmentsShow dictExerciseId={exercise.dictExerciseId} />}
                            </td>
                            <td>{exercise.weight}&nbsp;{exercise.weightUnit}</td>
                            <td>{exercise.repetitions}</td>
                            <td>{exercise.repetitionsUnit}</td>
                            <td>
                                <EditableExecutedCell
                                    exerciseId={exercise.exerciseId}
                                    value={exercise.executed ?? false}
                                    onSave={() => { }}
                                    onUpdate={(exerciseId: string) => ExercisesSessionService.updateExecuted(exerciseId)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderTabs = () => (
        <Tabs>
            <TabList>
                {clientPrograms.map((program, index) => (
                    <Tab key={index}>{program.name}</Tab>
                ))}
            </TabList>

            {clientPrograms.map((program, programIndex) => (
                <TabPanel key={programIndex}>
                    {program.macrocycles.length === 1 ? (
                        program.macrocycles[0].mesocycles.length === 1 ? (
                            <Tabs>
                                <TabList>
                                    {program.macrocycles[0].mesocycles[0].microcycles.map((microcycle, microcycleIndex) => (
                                        <Tab key={microcycleIndex}>{t("microcycle.week")} {microcycleIndex + 1}</Tab>
                                    ))}
                                </TabList>

                                {program.macrocycles[0].mesocycles[0].microcycles.map((microcycle, microcycleIndex) => (
                                    <TabPanel key={microcycleIndex}>
                                        <Tabs>
                                            <TabList>
                                                {microcycle.sessions.map((session, sessionIndex) => (
                                                    <Tab key={sessionIndex}>{t("session.session")} {sessionIndex + 1}</Tab>
                                                ))}
                                            </TabList>

                                            {microcycle.sessions.map((session, sessionIndex) => (
                                                <TabPanel key={sessionIndex}>
                                                    {renderExercisesTable(session.exercises)}
                                                </TabPanel>
                                            ))}
                                        </Tabs>
                                    </TabPanel>
                                ))}
                            </Tabs>
                        ) : (
                            <Tabs>
                                <TabList>
                                    {program.macrocycles[0].mesocycles.map((mesocycle, mesocycleIndex) => (
                                        <Tab key={mesocycleIndex}>Mesocycle {mesocycleIndex + 1}</Tab>
                                    ))}
                                </TabList>

                                {program.macrocycles[0].mesocycles.map((mesocycle, mesocycleIndex) => (
                                    <TabPanel key={mesocycleIndex}>
                                        <Tabs>
                                            <TabList>
                                                {mesocycle.microcycles.map((microcycle, microcycleIndex) => (
                                                    <Tab key={microcycleIndex}>{t("microcycle.week")} {microcycleIndex + 1}</Tab>
                                                ))}
                                            </TabList>

                                            {mesocycle.microcycles.map((microcycle, microcycleIndex) => (
                                                <TabPanel key={microcycleIndex}>
                                                    <Tabs>
                                                        <TabList>
                                                            {microcycle.sessions.map((session, sessionIndex) => (
                                                                <Tab key={sessionIndex}>{t("session.session")} {sessionIndex + 1}</Tab>
                                                            ))}
                                                        </TabList>

                                                        {microcycle.sessions.map((session, sessionIndex) => (
                                                            <TabPanel key={sessionIndex}>
                                                                {renderExercisesTable(session.exercises)}
                                                            </TabPanel>
                                                        ))}
                                                    </Tabs>
                                                </TabPanel>
                                            ))}
                                        </Tabs>
                                    </TabPanel>
                                ))}
                            </Tabs>
                        )
                    ) : (
                        <Tabs>
                            <TabList>
                                {program.macrocycles.map((macrocycle, macrocycleIndex) => (
                                    <Tab key={macrocycleIndex}>Macrocycle {macrocycleIndex + 1}</Tab>
                                ))}
                            </TabList>

                            {program.macrocycles.map((macrocycle, macrocycleIndex) => (
                                <TabPanel key={macrocycleIndex}>
                                    <Tabs>
                                        <TabList>
                                            {macrocycle.mesocycles.map((mesocycle, mesocycleIndex) => (
                                                <Tab key={mesocycleIndex}>Mesocycle {mesocycleIndex + 1}</Tab>
                                            ))}
                                        </TabList>

                                        {macrocycle.mesocycles.map((mesocycle, mesocycleIndex) => (
                                            <TabPanel key={mesocycleIndex}>
                                                <Tabs>
                                                    <TabList>
                                                        {mesocycle.microcycles.map((microcycle, microcycleIndex) => (
                                                            <Tab key={microcycleIndex}>{t("microcycle.week")} {microcycleIndex + 1}</Tab>
                                                        ))}
                                                    </TabList>

                                                    {mesocycle.microcycles.map((microcycle, microcycleIndex) => (
                                                        <TabPanel key={microcycleIndex}>
                                                            <Tabs>
                                                                <TabList>
                                                                    {microcycle.sessions.map((session, sessionIndex) => (
                                                                        <Tab key={sessionIndex}>{t("session.session")} {sessionIndex + 1}</Tab>
                                                                    ))}
                                                                </TabList>

                                                                {microcycle.sessions.map((session, sessionIndex) => (
                                                                    <TabPanel key={sessionIndex}>
                                                                        {renderExercisesTable(session.exercises)}
                                                                    </TabPanel>
                                                                ))}
                                                            </Tabs>
                                                        </TabPanel>
                                                    ))}
                                                </Tabs>
                                            </TabPanel>
                                        ))}
                                    </Tabs>
                                </TabPanel>
                            ))}
                        </Tabs>
                    )}
                </TabPanel>
            ))}
        </Tabs>
    );

    return (
        <div>
            {renderTabs()}
        </div>
    );
};

export default PersonalTrainings;
