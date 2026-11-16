import React from "react";
import { Chart } from "react-google-charts";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import { useGetVolumeMaxVolumeAvgVolumeForEachExerciseEachTraining, useGetTimeMaxTimeAvgTimeForEachExerciseEachTraining } from "../../../../../services/diagrams/DiagramTanstackService";
import {
  VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining,
  TimeMaxTimeAvgTimeForEachExerciseEachTraining,
} from "../../../../../types/types";  
import { withTranslation } from "react-i18next";
import Spinner from "../../../../../common/Spinner";


interface Props {
  workbookId: number;
  t: any;
}

const DiagramPerExerciseUnified: React.FC<Props> = ({ workbookId, t }) => {
  const { data: volumeData = [], isLoading: isVolumeLoading } = useGetVolumeMaxVolumeAvgVolumeForEachExerciseEachTraining(workbookId);
  const { data: timeData = [], isLoading: isTimeLoading } = useGetTimeMaxTimeAvgTimeForEachExerciseEachTraining(workbookId);

  const loading = isVolumeLoading || isTimeLoading;

  if (loading) return <Spinner />;

  const categories = Array.from(new Set([
    ...volumeData.map((d: VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining) => d.category),
    ...timeData.map((d: TimeMaxTimeAvgTimeForEachExerciseEachTraining) => d.category),
  ]));

  const renderChart = (
    exercise: string,
    exerciseData: any[],
    isTime: boolean
  ) => {
    const chartData = [
      ["Date"
        , t("diagram.series") + " 1"
        , t("diagram.series") + " 2"
        , t("diagram.series") + " 3"
        , t("diagram.series") + " 4"
        , t("diagram.series") + " 5"
        , t("diagram.avarage")
        , t("diagram.max")],
      ...exerciseData.map((d) => [
        d.date,
        isTime ? d.timeCol01 : d.volumeCol01,
        isTime ? d.timeCol02 : d.volumeCol02,
        isTime ? d.timeCol03 : d.volumeCol03,
        isTime ? d.timeCol04 : d.volumeCol04,
        isTime ? d.timeCol05 : d.volumeCol05,
        isTime ? d.timeAvg : d.volumeAvg,
        isTime ? d.timeMax : d.volumeMax,
      ])
    ];

    const options = {
      animation: {
        startup: false,
        duration: 2000,
      },
      title: `${exercise}${isTime ? " (" + t("diagram.time") + ")" : " (" + t("diagram.weight") + ")"}`,
      titleTextStyle: { color: '#8e7f90' },
      backgroundColor: 'transparent',
      hAxis: {
        title: "Date",
        titleTextStyle: { color: '#8e7f90' },
        textStyle: { color: '#8e7f90' },
      },
      vAxis: {
        title: isTime ? "[s]" : "[kg]",
        titleTextStyle: { color: '#8e7f90' },
        textStyle: { color: '#8e7f90' },
        minValue: 0,
      },
      seriesType: "bars",
      series: {
        0: { color: isTime ? "#f57c00" : "#4caf50" },
        1: { color: isTime ? "#f57c00" : "#4caf50" },
        2: { color: isTime ? "#f57c00" : "#4caf50" },
        3: { color: isTime ? "#f57c00" : "#4caf50" },
        4: { color: isTime ? "#f57c00" : "#4caf50" },
        5: { type: "line", color: "#3366CC" }, // avg
        6: { type: "line", color: "#800080" }, // max
      },
      legend: { textStyle: { color: '#8e7f90' } },
    };

    return (
      <div key={exercise} style={{ marginBottom: "2rem", overflowX: "auto", overflowY: "hidden" }}>
        <div style={{ minWidth: `${exerciseData.length * 40}px` }}>
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
  };

  if (volumeData.length >= 1 || timeData.length >= 1) {
    return (
      <Tabs>
        <TabList>
          {categories.map((category) => (
            <Tab key={category}>{category}</Tab>
          ))}
        </TabList>

        {categories.map((category) => {
          const exercises = Array.from(new Set([
            ...volumeData.filter((d: VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining) => d.category === category).map((d: VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining) => d.exercise),
            ...timeData.filter((d: TimeMaxTimeAvgTimeForEachExerciseEachTraining) => d.category === category).map((d: TimeMaxTimeAvgTimeForEachExerciseEachTraining) => d.exercise),
          ]));

          return (
            <TabPanel key={category}>
              {exercises.map((exercise) => {
                const volumeExerciseData: VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining[]
                = volumeData
                  .filter((d: VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining) => d.category === category && d.exercise === exercise)
                  .sort((a: VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining, b:VolumeMaxVolumeAvgVolumeForEachExerciseEachTraining) => a.date.localeCompare(b.date));

                const timeExerciseData: TimeMaxTimeAvgTimeForEachExerciseEachTraining[] 
                = timeData
                  .filter((d:TimeMaxTimeAvgTimeForEachExerciseEachTraining) => d.category === category && d.exercise === exercise)
                  .sort((a: TimeMaxTimeAvgTimeForEachExerciseEachTraining, b: TimeMaxTimeAvgTimeForEachExerciseEachTraining) => a.date.localeCompare(b.date));

                return (
                  <div key={exercise}>
                    {volumeExerciseData.length > 0 && renderChart(exercise, volumeExerciseData, false)}
                    {timeExerciseData.length > 0 && renderChart(exercise, timeExerciseData, true)}
                  </div>
                );
              })}
            </TabPanel>
          );
        })}
      </Tabs>
    );
  } else {
    return null;
  }
};

export default withTranslation("global")(DiagramPerExerciseUnified);
