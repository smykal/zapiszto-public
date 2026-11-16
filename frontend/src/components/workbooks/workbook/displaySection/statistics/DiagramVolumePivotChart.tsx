import React from "react";
import { Chart } from "react-google-charts";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import { VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining } from '../../../../../types/types';
import { useGetVolumeMaxVolumeAvgVolumeForEachExerciseEachTraining } from "../../../../../services/diagrams/DiagramTanstackService";

interface Props {
    workbookId: number;
}

export const DiagramVolumePerExercise: React.FC<Props> = ({ workbookId }) => {
    const { data = [], isLoading: loading } = useGetVolumeMaxVolumeAvgVolumeForEachExerciseEachTraining(workbookId);

    if (loading) return <span className="loader" />;

    const categories: string[] = Array.from(new Set(data.map((d: VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining) => d.category)));

    return (
        <Tabs>
            <TabList>
                {categories.map((category: string) => (
                    <Tab key={String(category)}>{category}</Tab>
                ))}
            </TabList>

            {categories.map((category: string) => {
                const exercises: string[] = Array.from(new Set(data.filter((d: VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining) => d.category === category).map((d: VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining) => d.exercise)));

                return (
                    <TabPanel key={String(category)}>
                        {exercises.map((exercise: string) => {
                            const exerciseData = data
                                .filter((d: VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining) => d.exercise === exercise && d.category === category)
                                .sort((a: VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining, b: VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining) => a.date.localeCompare(b.date));

                            const chartData = [
                                ["Date", "seria 1", "seria 2", "seria 3", "seria 4", "seria 5", "Avarage", "Max"],
                                ...exerciseData.map((d: VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining) => [
                                    d.date,
                                    d.volumeCol01,
                                    d.volumeCol02,
                                    d.volumeCol03,
                                    d.volumeCol04,
                                    d.volumeCol05,
                                    d.volumeAvg,
                                    d.volumeMax,
                                ]),
                            ];

                            const options = {
                                animation: {
                                    startup: true,
                                    duration: 2000
                                },
                                title: `${exercise}`,
                                titleTextStyle: { color: '#8e7f90' },
                                backgroundColor: 'transparent',
                                hAxis: {
                                    title: "Date",
                                    titleTextStyle: { color: '#8e7f90' },
                                    textStyle: { color: '#8e7f90' },
                                },
                                vAxis: {
                                    title: "[kg]",
                                    titleTextStyle: { color: '#8e7f90' },
                                    textStyle: { color: '#8e7f90' },
                                },
                                seriesType: "bars",
                                series: {
                                    0: { color: "#4caf50" },
                                    1: { color: "#4caf50" },
                                    2: { color: "#4caf50" },
                                    3: { color: "#4caf50" },
                                    4: { color: "#4caf50" },
                                    5: { type: "line", color: "#3366CC" },// volumeAvg
                                    6: { type: "line", color: "#800080" }, // volumeMax
                                },
                                legend: { textStyle: { color: '#8e7f90' } },
                            };

                            return (
                                <div key={String(exercise)}
                                    style={{
                                        marginBottom: "2rem",
                                        overflowX: "auto",
                                        overflowY: "hidden"
                                    }}>
                                    <div style={{ minWidth: `${exerciseData.length * 40}px` }}> {/* 100px na kolumnę, dopasuj jeśli trzeba */}
                                        <Chart
                                            chartType="ComboChart"
                                            width="100%"
                                            height="400px"
                                            data={chartData}
                                            options={options}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </TabPanel>
                );
            })}
        </Tabs>
    );
};