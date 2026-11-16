import React, { useEffect, useState } from "react";
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import { Workbook } from '../../types/types';
import Wrapper from './workbook/Wrapper';
import { useTranslation } from "react-i18next";
import Modal from "../../constants/Modal";
import DiagramTrainingFrequency from "./workbook/displaySection/statistics/DiagramTrainingFrequency";
import DiagramRepetitionsSetsVolume from "./workbook/displaySection/statistics/DiagramRepetitionsSetsVolume";
import DiagramExerciseComboChart from "./workbook/displaySection/statistics/DiagramExerciseComboChart";
import PersonalTrainingsByUser from "./workbook/displaySection/personalTrainings/PersonalTrainingsByUser";
import Options from './workbook/workbookOptions/Options';
import { useGetWorkbooks, usePostNewWorkbook } from '../../services/workbooks/WorkbooksTanstackService';

const Training: React.FC = () => {
    const { t } = useTranslation("global");
    const { data: workbooks = [] } = useGetWorkbooks();
    const postNewWorkbook = usePostNewWorkbook();
    const [newWorkbookName, setNewWorkbookName] = useState('');
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const lastActiveTabIndex = localStorage.getItem('lastActiveTabIndex');
        if (lastActiveTabIndex !== null) {
            setActiveTabIndex(parseInt(lastActiveTabIndex));
        }
    }, []);

    const handleNewWorkbookNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewWorkbookName(event.target.value);
    };

    const handleAddWorkbook = async () => {
        if (newWorkbookName.trim() === '') {
            setShowModal(false);
            return;
        }

        try {
            await postNewWorkbook.mutateAsync(newWorkbookName);
            setNewWorkbookName('');
        } catch (error) {
            console.error('Error adding workbook:', error);
        } finally {
            setShowModal(false);
        }
    };

    const handleTabSelect = (index: number) => {
        setActiveTabIndex(index);
        localStorage.setItem('lastActiveTabIndex', index.toString());
    };

    const toggleModal = () => {
        setShowModal((prevState) => !prevState);
    };

    return (
        <div className="card-container">
            {workbooks.length === 0 ? (
                <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                    <p>{t("workbooks.begin_by_adding_new_workbook")}</p>
                    <button onClick={toggleModal} className="button">
                        {t("workbooks.add_new_workbook")}
                    </button>
                </div>
            ) : (
                <Tabs selectedIndex={activeTabIndex} onSelect={handleTabSelect}>
                    <TabList>
                        {workbooks.map((workbook: Workbook) => (
                            <Tab key={workbook.id}>{workbook.name}</Tab>
                        ))}
                        <Tab><p style={{ color: 'gray' }}>{t("clients.personal_trainings")}</p></Tab>
                        <Tab onClick={toggleModal}>+</Tab>
                    </TabList>

                    {workbooks.map((workbook: Workbook) => (
                        <TabPanel key={workbook.id}>
                            <Tabs>
                                <TabList>
                                    <Tab>{t("workbooks.exercises")}</Tab>
                                    <Tab>{t("workbooks.statistics")}</Tab>
                                    <Tab>
                                        <img
                                            src="/images/navigation/options.svg"
                                            alt="Options"
                                            style={{ cursor: "pointer", width: "18px", height: "16px" }}
                                        />
                                    </Tab>
                                </TabList>

                                <TabPanel>
                                    <Wrapper workbook={workbook} />
                                </TabPanel>

                                <TabPanel>
                                    <DiagramExerciseComboChart workbookId={workbook.id} />
                                    <DiagramRepetitionsSetsVolume workbookId={workbook.id} />
                                    <DiagramTrainingFrequency workbookId={workbook.id} />
                                </TabPanel>

                                <TabPanel>
                                    <Options workbook={workbook} />
                                </TabPanel>
                            </Tabs>
                        </TabPanel>
                    ))}

                    <TabPanel>
                            <PersonalTrainingsByUser />
                    </TabPanel>
                </Tabs>
            )}

            <Modal show={showModal} onClose={toggleModal} title={t("workbooks.add_new_workbook")}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
                    <input
                        type="text"
                        value={newWorkbookName}
                        onChange={handleNewWorkbookNameChange}
                        placeholder={t("workbooks.enter_new_workbook_name")}
                    />
                    <button onClick={handleAddWorkbook}>{t("buttons.add")}</button>
                </div>
            </Modal>
        </div>
    );
};

export default Training;